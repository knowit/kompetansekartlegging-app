# Pre-run

Before you you run the script, you need to create a new file called ui_params.json.
This is a json file that should contain the userpool id, the app client id(s) in the user pool and the AWS Profile name.

Empty file:
```
    {
        "iam_user": "",
        "userpool_id": "",
        "app_client_id": ["", ""] // or "app_client_id: ""
    }
```



# Running the script

If you have done the things described above, you should be good to just run the script. Note: This script should be run after a user pool has already been set-up. It should also be run AFTER the `add_saml_provider.py` script has been run.

