from os import environ
import json
from datetime import datetime
import requests
import dataclasses as dataclass
from dataclasses_json import dataclass_json, LetterCase
import boto3
from typing import Union, Dict, List, AnyStr, Any, Callable

lowLevelBuckets = json.loads(environ["lowLevelBucketMap"])
level4Buckets = json.loads(environ["level4BucketMap"])

###
#  Dataclasses
###
@dataclass_json(letter_case=LetterCase.CAMEL)
@dataclass
class Response:
    status_code: int = 200
    body: str = ''

@dataclass_json
@dataclass
class Metadata:
    timestamp: Union[int, float]

@dataclass_json
@dataclass
class Data:
    metadata: Metadata
    data: Union[AnyStr, Dict, List]
###
# AWS Classes
###
class SQS:
    def __init__(self):
        self.client = boto3.client('sqs')

    def send_custom_filename_message(self, file_name: str = None, queue_name: str = None, group_id: str = None):
        response = self.client.get_queue_url(QueueName=queue_name or environ.get("SQS_QUEUE_NAME"))
        sqs_url = response['QueueUrl']
        res = self.client.send_message(
            QueueUrl=sqs_url,
            MessageBody=file_name,
            MessageAttributes={
                's3FileName': {
                    'StringValue': file_name,
                    'DataType': 'String'
                }
            },
            MessageGroupId=group_id or environ.get("SQS_MESSAGE_GROUP_ID"))
        return res['MessageId']

class S3:
    def __init__(self, access_path: str = None, bucket: str = None):
        self.access_path = environ.get("ACCESS_PATH") if access_path is None else access_path
        self.bucket = bucket or environ.get('DATALAKE')
        self.s3 = boto3.resource('s3')

    def put(self, data: Data, path: str = ''):
        data_json = data.to_json().encode('utf-8')
        return self.put_raw(data_json, ext='json', path=path)

    def put_raw(self, data: bytes, ext: str = '', path: str = '', key: str = None):
        if data is not None:
            if key is None:
                key = path_join(self.access_path, path, f'{uuid4()}.{ext}')
            else:
                key = path_join(self.access_path, path, key)
            s3_object = self.s3.Object(self.bucket, key)
            s3_object.put(Body=data)
            return key
        return None

    def get(self, key, catch_client_error=True) -> S3Result:
        key = path_join(self.access_path, key) if not key.startswith(self.access_path) else key
        try:
            res = self.s3.Object(self.bucket, key).get()
            return S3Result(res)
        except ClientError as e:
            if not catch_client_error:
                raise e
            return S3Result(None, error=e)

    # Filter is used to be able to specify the files that you wish to delete and keep the rest, handle with care.
    def empty_content_in_path(self, path, delete_all_versions=False, filter_val=None):
        prefix = path_join(self.access_path, path)
        bucket = self.s3.Bucket(self.bucket)
        if delete_all_versions:
            objects_to_be_deleted = bucket.object_versions.filter(Prefix=prefix)
        else:
            objects_to_be_deleted = bucket.objects.filter(Prefix=prefix)

        if filter_val is not None:
            delete_spec_list = []
            for obj in objects_to_be_deleted:
                if filter_val in obj.key:
                    delete_spec_list.append({'Key': obj.key})
                    try:
                        delete_spec_list[-1].update({'VersionId': obj.id})
                    except AttributeError:
                        pass
            if delete_spec_list:
                bucket.delete_objects(Delete={
                    'Objects': delete_spec_list
                })
        else:
            objects_to_be_deleted.delete()

    @property
    def fs(self):
        if 'fs_cache' in self.__dict__:
            return self.fs_cache

        def get_key(k):
            full_access_path = path_join(self.bucket, self.access_path)

            if k.startswith(full_access_path):
                return k
            elif k.startswith(self.access_path):
                return path_join(self.bucket, k)
            else:
                return path_join(full_access_path, k)

        class S3FileSystemProxy(S3FileSystem):
            def open(self, path, *args, **kwargs):
                return S3FileSystem.open(self, get_key(path), *args, **kwargs)

            def exists(self, path):
                return S3FileSystem.exists(self, get_key(path))

            def ls(self, path, **kwargs):
                return S3FileSystem.ls(self, get_key(path), **kwargs)

            def isdir(self, path):
                return S3FileSystem.isdir(self, get_key(path))

            def walk(self, path, *args, **kwargs):
                return S3FileSystem.walk(self, get_key(path), *args, **kwargs)

            def find(self, path, *args, **kwargs):
                return S3FileSystem.find(self, get_key(path), *args, **kwargs)

            def copy(self, path1, path2, **kwargs):
                return S3FileSystem.copy(self, get_key(path1), get_key(path2), **kwargs)

            def rm(self, path, **kwargs):
                return S3FileSystem.rm(self, get_key(path), **kwargs)

        self.fs_cache = S3FileSystemProxy(anon=False)
        return self.fs_cache

###
# Ingestor class
###
class IngestHandler:
    def __init__(self, access_path: str = None, bucket: str = None):
        self.access_path = access_path
        self.bucket = bucket
        self.wrapped_func: Dict[str, Callable] = {}
        self.wrapped_func_args: Dict[str, Any] = {}

    def __call__(self, event, context=None):
        if 'validate' in self.wrapped_func:
            result = self.wrapped_func['validate'](event)
            if result and isinstance(result, Response):
                return result.to_dict()

            if result is False:
                return Response(status_code=403).to_dict()

            if result and isinstance(result, str):
                return Response(status_code=403, body=result).to_dict()

        s3 = S3(
            access_path=self.access_path,
            bucket=self.bucket)

        assert 'ingest' in self.wrapped_func, \
            'IngestHandler must wrap and ingest function'

        result = self.wrapped_func['ingest'](event)
        overwrite = self.wrapped_func_args.get('ingest', {}).get('overwrite', False)
        if result and isinstance(result, Response):
            return result.to_dict()

        if result:
            if overwrite:
                s3.empty_content_in_path('raw', delete_all_versions=True)
            SQS().send_custom_filename_message(
                s3.put(result, 'raw'))

        return Response().to_dict()

    def ingest(self, event) -> Data:
        url = ""
        api_token = ""
        users = requests.get(f'{url}/users', headers={'x-api-key': api_token}).json()
        answers = requests.get(f'{url}/answers', headers={'x-api-key': api_token}).json()
        catalogs = requests.get(f'{url}/catalogs', headers={'x-api-key': api_token}).json()
        newest_catalog = answers[0]['formDefinitionID']

        categories = requests.get(f'{url}/catalogs/{newest_catalog}/categories',
                                headers={'x-api-key': api_token}).json()

        questions = requests.get(f'{url}/catalogs/{newest_catalog}/questions',
                                headers={'x-api-key': api_token}).json()
        return Data(
            metadata=Metadata(timestamp=datetime.now().timestamp()),
            data={'answers': answers,
                'users': users,
                'catalogs': catalogs,
                'categories': categories,
                'questions': questions}
        )
handler = IngestHandler()