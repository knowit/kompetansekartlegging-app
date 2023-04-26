import os
import sys
import json
from unittest import TestCase
from unittest.mock import MagicMock, patch, ANY
from boto3 import client
from moto import mock_secretsmanager

sys.path.append('../')
from slackAlarmForwarder.index import handler, create_payload, get_slack_webhook_url

os.environ["AWS_DEFAULT_REGION"] = "eu-central-1"
slack_url = "fake.url"
expected_payload_keys = ["mrkdwn_in", "title", "title_link", "text", "color"]

def create_event(new_state_value, alarm_name="Name", message_only=False):
    event = {
        "Records": [{
            "Sns": {
                "Message": json.dumps({
                    "Region": "EU (Frankfurt)",
                    "AlarmName": alarm_name,
                    "AWSAccountId": "accountID",
                    "NewStateValue": new_state_value,
                    "NewStateReason": "reason",
                })
            }
        }]
    }
    return event if not message_only else json.loads(event["Records"][0]["Sns"]["Message"])


@mock_secretsmanager
class TestConfigureNewOrganizationLambda(TestCase):

    def test_get_slack_webhook_url(self):
        # Create secret
        secrets_manager_client = client('secretsmanager')
        secrets_manager_client.create_secret(
            Name="slack_webhook_url",
            SecretString="{\"url\": \"" + slack_url + "\"}"
        )
        # Assert secret is retrieved correctly
        actual_url = get_slack_webhook_url(secrets_manager_client)
        self.assertEqual(slack_url, actual_url)


    def test_create_payload(self):
        alarm_name = "Important alarm"
        actual_payload = create_payload(
            msg=create_event(
                new_state_value="ALARM",
                alarm_name=alarm_name,
                message_only=True)
        )
        # Assert payload contains expected keys, alarm name and correct color
        self.assertTrue([expected_key in actual_payload.keys() for expected_key in expected_payload_keys])
        self.assertIn(alarm_name, actual_payload["text"])


    def test_create_payload_color_in_different_alarm_states(self):
        payload_alarm_state = create_payload(
            msg=create_event(
                new_state_value="ALARM",
                message_only=True)
        )
        payload_ok_state = create_payload(
            msg=create_event(
                new_state_value="OK",
                message_only=True)
        )
        # Assert payloads contains correct color
        self.assertEqual("danger", payload_alarm_state["color"])
        self.assertEqual("good", payload_ok_state["color"])


    def test_create_payload_ok_state(self):
        actual_payload = create_payload(
            msg=create_event(
                new_state_value="OK",
                message_only=True)
        )
        # Assert payload contains correct color
        self.assertEqual("good", actual_payload["color"])


    @patch("slackAlarmForwarder.index.get_slack_webhook_url", return_value=slack_url)
    @patch("slackAlarmForwarder.index.requests.post")
    def test_handler(
        self,
        patch_requests_post: MagicMock,
        patch_get_slack_webhook_url: MagicMock
    ):
        response = handler(
            event=create_event(alarm_name="name", new_state_value="ALARM"),
            context=None
        )
        # Assert handler returns 200, and that functions are called as expected
        self.assertEqual(200, response["status_code"])
        patch_get_slack_webhook_url.assert_called_once()
        patch_requests_post.assert_called_once_with(url=slack_url, json=ANY)
