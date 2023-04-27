import os
import sys
import json
from unittest import TestCase
from unittest.mock import MagicMock, patch, ANY
from boto3 import client
from moto import mock_secretsmanager

# Set environment variable before importing lambda
os.environ["AWS_DEFAULT_REGION"] = "eu-central-1"

sys.path.append('../')
from slackAlarmForwarder.index import handler, create_payload, get_slack_webhook_url

slack_url = "slack.url"
expected_payload_keys = ["mrkdwn_in", "title", "title_link", "text", "color"]

# Helper function to create an alarm event similar to what SNS sends to the Lambda
def get_alarm_event(alarm_name="Name", new_state_value="Alarm", new_state_reason="Reason", message_only=False):
    event = {
        "Records": [{
            "Sns": {
                "Message": json.dumps({
                    "Region": "EU (Frankfurt)",
                    "AlarmName": alarm_name,
                    "AWSAccountId": "accountID",
                    "NewStateValue": new_state_value,
                    "NewStateReason": new_state_reason,
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


    def test_create_payload_alarm_state(self):
        alarm_name = "Alarm 1"
        new_state_value = "ALARM"
        new_state_reason = "Threshold Crossed: datapoint greater than or equal to threshold"

        payload = create_payload(
            msg=get_alarm_event(
                alarm_name=alarm_name,
                new_state_value=new_state_value,
                new_state_reason=new_state_reason,
                message_only=True)
        )
        # Assert payload contains expected keys and values
        self.assertTrue([expected_key in payload.keys() for expected_key in expected_payload_keys])
        self.assertIn(alarm_name, payload["title"])
        self.assertIn(new_state_value, payload["text"])
        self.assertIn(new_state_reason, payload["text"])
        self.assertEqual("danger", payload["color"])


    def test_create_payload_ok_state(self):
        alarm_name = "Alarm 2"
        new_state_value = "OK"
        new_state_reason = "Threshold Crossed: missing datapoint treated as [NonBreaching]"

        payload = create_payload(
            msg=get_alarm_event(
                alarm_name=alarm_name,
                new_state_value=new_state_value,
                new_state_reason=new_state_reason,
                message_only=True)
        )
        # Assert payload contains expected keys and values
        self.assertTrue([expected_key in payload.keys() for expected_key in expected_payload_keys])
        self.assertIn(alarm_name, payload["title"])
        self.assertIn(new_state_value, payload["text"])
        self.assertIn(new_state_reason, payload["text"])
        self.assertEqual("good", payload["color"])


    @patch("slackAlarmForwarder.index.create_payload")
    @patch("slackAlarmForwarder.index.get_slack_webhook_url", return_value=slack_url)
    @patch("slackAlarmForwarder.index.requests.post")
    def test_handler(
        self,
        patch_requests_post: MagicMock,
        patch_get_slack_webhook_url: MagicMock,
        patch_create_payload: MagicMock
    ):
        response = handler(
            event=get_alarm_event(),
            context=None
        )
        # Assert handler returns 200, and that functions are called as expected
        self.assertEqual(200, response["status_code"])
        patch_create_payload.assert_called_once()
        patch_get_slack_webhook_url.assert_called_once()
        patch_requests_post.assert_called_once_with(url=slack_url, json=ANY)
