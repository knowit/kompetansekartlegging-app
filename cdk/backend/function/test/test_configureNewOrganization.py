import os
import sys
from unittest import TestCase
from unittest.mock import MagicMock, patch
from boto3 import client
from moto import mock_cognitoidp, mock_dynamodb

# Set environment variables before importing lambda
os.environ["AWS_DEFAULT_REGION"] = "eu-central-1"
os.environ["GROUP"] = "admin"

sys.path.append('../configureNewOrganization')
from index import handler, create_groups, user_already_exists, create_admin_user 


@mock_cognitoidp
@mock_dynamodb # TODO: replace with aurora and write tests (after migration is complete)
class TestConfigureNewOrganizationLambda(TestCase):

    def setUp(self):
        self.cognito_client = client("cognito-idp")
        self.cognito_userpool_id = self.cognito_client.create_user_pool(PoolName="TestUserPool")["UserPool"]["Id"]


    def test_create_groups(self):
        new_org_id = "newOrg"
        expected_group_names = [new_org_id, f'{new_org_id}0admin', f'{new_org_id}0groupLeader']

        # Create groups
        create_groups(
            org_id=new_org_id,
            userpool_id=self.cognito_userpool_id,
            cognito_client=self.cognito_client
        )
        # Get names of groups that were created
        actual_groups = self.cognito_client.list_groups(UserPoolId=self.cognito_userpool_id)["Groups"]
        actual_group_names = [group["GroupName"] for group in actual_groups]

        # Assert all expected groups were created
        self.assertEqual(3, len(actual_groups))
        self.assertTrue(all(expected_group_name in actual_group_names for expected_group_name in expected_group_names))


    def test_user_already_exists(self):
        email = "name@surname"

        # Assert user does not exist
        self.assertFalse(
            user_already_exists(
                email=email,
                userpool_id=self.cognito_userpool_id,
                cognito_client=self.cognito_client
            )
        )
        # Create user
        self.cognito_client.admin_create_user(
            UserPoolId = self.cognito_userpool_id,
            Username = email,
            MessageAction = "SUPPRESS",
            UserAttributes = [{"Name": "email", "Value": email}]
        )

        # Assert user exists
        self.assertTrue(
            user_already_exists(
                email=email,
                userpool_id=self.cognito_userpool_id,
                cognito_client=self.cognito_client
            )
        )


    def test_create_admin_user(self):
        new_org_id = "newOrg"
        expected_group_names = [new_org_id, f'{new_org_id}0admin']
        email = "admin@user"

        # Create groups
        for group_name in expected_group_names:
            self.cognito_client.create_group(
                UserPoolId=self.cognito_userpool_id,
                GroupName=group_name
            )
        # Assert user does not exist
        self.assertFalse(
            user_already_exists(
                email=email,
                userpool_id=self.cognito_userpool_id,
                cognito_client=self.cognito_client
            )
        )
        # Create admin user
        create_admin_user(
            org_id=new_org_id,
            email=email,
            userpool_id=self.cognito_userpool_id,
            cognito_client=self.cognito_client
        )
        # Assert admin user exists
        self.assertTrue(
            user_already_exists(
                email=email,
                userpool_id=self.cognito_userpool_id,
                cognito_client=self.cognito_client
            )
        )
        # List groups for admin user
        actual_groups = self.cognito_client.admin_list_groups_for_user(
            Username=email,
            UserPoolId=self.cognito_userpool_id
        )["Groups"]
        actual_group_names = [group["GroupName"] for group in actual_groups]
        
        # Assert user is a member of all expected groups
        self.assertEqual(2, len(actual_groups))
        self.assertTrue(all(expected_group_name in actual_group_names for expected_group_name in expected_group_names))


    def test_handler_returns_401_if_not_super_admin(self):
        event = {
            "requestContext": {
                "authorizer": {
                    "claims": {
                        "cognito:groups": "org,org0admin,org0groupLeader"
                    }
                }
            }
        }
        return_value = handler(event=event, context=None)
        self.assertEqual(return_value["statusCode"], 401)


    @patch("index.create_groups")
    @patch("index.user_already_exists", return_value=False)
    @patch("index.create_admin_user")
    @patch("index.create_default_form_definition")
    def test_handler_with_admin_creation(
        self,
        patch_create_default_form_definition: MagicMock,
        patch_create_admin_user: MagicMock,
        patch_user_already_exists: MagicMock,
        patch_create_groups: MagicMock
    ):
        new_org_id = "newOrg"
        new_admin_email = "new@admin"
        event = {
            "requestContext": {
                "authorizer": {
                    "claims": {
                        "cognito:groups": "org,org0admin,admin"
                    }
                }
            },
            "queryStringParameters": {
                "organization_id": new_org_id,
                "admin_email": new_admin_email
            }
        }
        return_value = handler(event=event, context=None)

        self.assertEqual(return_value["statusCode"], 200)

        patch_create_groups.assert_called_once_with(new_org_id)
        patch_user_already_exists.assert_called_once_with(new_admin_email)
        patch_create_admin_user.assert_called_once_with(new_org_id, new_admin_email)
        patch_create_default_form_definition.assert_called_once_with(new_org_id)


    @patch("index.create_groups")
    @patch("index.user_already_exists")
    @patch("index.create_admin_user")
    @patch("index.create_default_form_definition")
    def test_handler_without_admin_creation(
        self,
        patch_create_default_form_definition: MagicMock,
        patch_create_admin_user: MagicMock,
        patch_user_already_exists: MagicMock,
        patch_create_groups: MagicMock
    ):
        new_org_id = "newOrg"
        new_admin_email = ""
        event = {
            "requestContext": {
                "authorizer": {
                    "claims": {
                        "cognito:groups": "org,org0admin,admin"
                    }
                }
            },
            "queryStringParameters": {
                "organization_id": new_org_id,
                "admin_email": new_admin_email
            }
        }
        return_value = handler(event=event, context=None)

        self.assertEqual(return_value["statusCode"], 200)

        patch_create_groups.assert_called_once_with(new_org_id)
        patch_user_already_exists.assert_not_called()
        patch_create_admin_user.assert_not_called()
        patch_create_default_form_definition.assert_called_once_with(new_org_id)
