#!/usr/bin/env python3

# Original code: https://www.matscloud.com/blog/2020/06/25/how-to-use-aws-cdk-with-aws-sso-profiles/

import json
import os
import sys
from configparser import ConfigParser
from datetime import datetime
from pathlib import Path

import boto3

AWS_CONFIG_PATH = f"{Path.home()}/.aws/config"
AWS_CREDENTIAL_PATH = f"{Path.home()}/.aws/credentials"
AWS_SSO_CACHE_PATH = f"{Path.home()}/.aws/sso/cache"
AWS_DEFAULT_REGION = "eu-central-1"

def set_profile_credentials(profile_name):
    profile = get_aws_profile(profile_name)
    cache_login = get_sso_cached_login(profile)
    credentials = get_sso_role_credentials(profile, cache_login)
    update_aws_credentials(profile_name, profile, credentials)

def get_sso_cached_login(profile):
    file_paths = list_directory(AWS_SSO_CACHE_PATH)
    time_now = datetime.now()
    for file_path in file_paths:
        data = load_json(file_path)
        if data is None:
            continue
        if data.get("startUrl") != profile["sso_start_url"]:
            continue
        if data.get("region") != profile["sso_region"]:
            continue
        if time_now > parse_timestamp(data.get("expiresAt", "1970-01-01T00:00:00UTC")):
            continue
        return data
    raise Exception("Current cached SSO login is expired or invalid")


def get_sso_role_credentials(profile, login):
    client = boto3.client("sso", region_name=profile["sso_region"])
    response = client.get_role_credentials(
        roleName=profile["sso_role_name"],
        accountId=profile["sso_account_id"],
        accessToken=login["accessToken"],
    )
    return response["roleCredentials"]

def get_aws_profile(profile_name):
    config = read_config(AWS_CONFIG_PATH)
    profile_opts = config.items(f"profile {profile_name}")
    profile = dict(profile_opts)

    try:
        session_opts = config.items(f"sso-session {profile_name}")
        profile.update(dict(session_opts))
    except:
        pass # Old versions of AWS CLI did not use sso sessions, while newer do.
             # If sessions are included, we need to get the token from there
    return profile

def update_aws_credentials(profile_name, profile, credentials):
    region = profile.get("region", AWS_DEFAULT_REGION)
    config = read_config(AWS_CREDENTIAL_PATH)
    if config.has_section(profile_name):
        config.remove_section(profile_name)
    config.add_section(profile_name)
    config.set(profile_name, "region", region)
    config.set(profile_name, "aws_access_key_id", credentials["accessKeyId"])
    config.set(profile_name, "aws_secret_access_key", credentials["secretAccessKey"])
    config.set(profile_name, "aws_session_token", credentials["sessionToken"])
    write_config(AWS_CREDENTIAL_PATH, config)

def list_directory(path):
    file_paths = []
    if os.path.exists(path):
        file_paths = Path(path).iterdir()
    file_paths = sorted(file_paths, key=os.path.getmtime)
    file_paths.reverse()  # sort by recently updated
    return [str(f) for f in file_paths]

def load_json(path):
    try:
        with open(path) as context:
            return json.load(context)
    except ValueError:
        pass  # ignore invalid json

def parse_timestamp(value):
    return datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ")

def read_config(path):
    config = ConfigParser()
    config.read(path)
    return config

def write_config(path, config):
    with open(path, "w") as destination:
        config.write(destination)

def script_handler(args):
    profile_name = "default"
    if len(args) == 2:
        profile_name = args[1]
    set_profile_credentials(profile_name)

if __name__ == "__main__":
    script_handler(sys.argv)