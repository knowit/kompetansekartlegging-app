# Pre-run

Before you you run the script, you need to create a new file called saml_params.json.
This is a json file that should contain the userpool id, the metadata url from the saml provider and the AWS Profile name.

Empty file:
```
    {
        "iam_user": "",
        "userpool_id": "",
        "metadata_url": ""
    }
```

You will also need to add a couple of things to the Azure AD side of things before running the script.
Under Identifier (Entity ID) in the Basic SAML configuration tab, you need to add `urn:amazon:cognito:sp:<userpool_id>` 

You might also need to add a callback url that should look similar to `https://<amplify_auth_id>-<env>.auth.<region>.amazoncognito.com/saml2/idpresponse` to Azure.

# Running the script

If you have done the things described above, you should be good to just run the script. Note: This script should be run after a user pool has already been set-up. It will only add a SAML Identity provider to existing Cognito User pools.

