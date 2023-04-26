import os
import sys
from unittest import TestCase
from unittest.mock import MagicMock, patch
from boto3 import client
from moto import mock_cognitoidp

# Set environment variables before importing lambda
os.environ["AWS_DEFAULT_REGION"] = "eu-central-1"
os.environ["GROUP"] = "admin"

sys.path.append('../configureNewOrganization')
from index import handler, create_groups, user_already_exists, add_user_to_groups, create_admin_user

new_org_id = "newOrg"
new_email = "new@email"

@mock_cognitoidp
class TestConfigureNewOrganizationLambda(TestCase):

    def setUp(self):
        self.cognito_client = client("cognito-idp")
        self.cognito_userpool_id = self.cognito_client.create_user_pool(PoolName="TestUserPool")["UserPool"]["Id"]


    def test_create_groups(self):
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
        # Assert user does not exist
        self.assertFalse(
            user_already_exists(
                email=new_email,
                userpool_id=self.cognito_userpool_id,
                cognito_client=self.cognito_client
            )
        )
        # Create user
        self.cognito_client.admin_create_user(
            UserPoolId = self.cognito_userpool_id,
            Username = new_email,
            MessageAction = "SUPPRESS",
            UserAttributes = [{"Name": "email", "Value": new_email}]
        )
        # Assert user exists
        self.assertTrue(
            user_already_exists(
                email=new_email,
                userpool_id=self.cognito_userpool_id,
                cognito_client=self.cognito_client
            )
        )


    def test_add_user_to_groups(self):
        expected_group_names = [new_org_id, f'{new_org_id}0admin']

        # Create groups
        for group_name in expected_group_names:
            self.cognito_client.create_group(
                UserPoolId=self.cognito_userpool_id,
                GroupName=group_name
            )
        # Create user
        self.cognito_client.admin_create_user(
            UserPoolId = self.cognito_userpool_id,
            Username = new_email,
            MessageAction = "SUPPRESS",
            UserAttributes = [{"Name": "email", "Value": new_email}]
        )
        # Add user to groups
        add_user_to_groups(
            org_id=new_org_id,
            email=new_email,
            userpool_id=self.cognito_userpool_id,
            cognito_client=self.cognito_client
        )
        # List groups for user
        actual_groups = self.cognito_client.admin_list_groups_for_user(
            Username=new_email,
            UserPoolId=self.cognito_userpool_id
        )["Groups"]
        actual_group_names = [group["GroupName"] for group in actual_groups]

        # Assert user was added to expected groups
        self.assertEqual(2, len(actual_groups))
        self.assertTrue(all(expected_group_name in actual_group_names for expected_group_name in expected_group_names))


    def test_create_admin_user(self):
        expected_group_names = [new_org_id, f'{new_org_id}0admin']

        # Create groups
        for group_name in expected_group_names:
            self.cognito_client.create_group(
                UserPoolId=self.cognito_userpool_id,
                GroupName=group_name
            )
        # Assert user does not exist
        self.assertFalse(
            user_already_exists(
                email=new_email,
                userpool_id=self.cognito_userpool_id,
                cognito_client=self.cognito_client
            )
        )
        # Create admin user
        create_admin_user(
            org_id=new_org_id,
            email=new_email,
            userpool_id=self.cognito_userpool_id,
            cognito_client=self.cognito_client
        )
        # Assert admin user exists
        self.assertTrue(
            user_already_exists(
                email=new_email,
                userpool_id=self.cognito_userpool_id,
                cognito_client=self.cognito_client
            )
        )
        # List groups for admin user
        actual_groups = self.cognito_client.admin_list_groups_for_user(
            Username=new_email,
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

    # TODO: Write tests after migrating from DynamoDB to Aurora
    # (create_default_form_definition & default_form_definition_already_exists)

    @patch("index.create_groups")
    @patch("index.user_already_exists", return_value=False)
    @patch("index.create_admin_user")
    @patch("index.create_default_form_definition")
    def test_handler_returns_200_with_admin_creation(
        self,
        patch_create_default_form_definition: MagicMock,
        patch_create_admin_user: MagicMock,
        patch_user_already_exists: MagicMock,
        patch_create_groups: MagicMock
    ):
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
                "admin_email": new_email
            }
        }
        return_value = handler(event=event, context=None)

        self.assertEqual(return_value["statusCode"], 200)

        patch_create_groups.assert_called_once_with(new_org_id)
        patch_user_already_exists.assert_called_once_with(new_email)
        patch_create_admin_user.assert_called_once_with(new_org_id, new_email)
        patch_create_default_form_definition.assert_called_once_with(new_org_id)


    @patch("index.create_groups")
    @patch("index.user_already_exists")
    @patch("index.create_admin_user")
    @patch("index.create_default_form_definition")
    def test_handler_returns_200_without_admin_creation(
        self,
        patch_create_default_form_definition: MagicMock,
        patch_create_admin_user: MagicMock,
        patch_user_already_exists: MagicMock,
        patch_create_groups: MagicMock
    ):
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
                "admin_email": ""
            }
        }
        return_value = handler(event=event, context=None)

        self.assertEqual(return_value["statusCode"], 200)

        patch_create_groups.assert_called_once_with(new_org_id)
        patch_user_already_exists.assert_not_called()
        patch_create_admin_user.assert_not_called()
        patch_create_default_form_definition.assert_called_once_with(new_org_id)
