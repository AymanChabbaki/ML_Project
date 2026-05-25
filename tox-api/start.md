1. Build the updated image:

PowerShell
docker build -t toxapiayman.azurecr.io/tox-backend:v1 .
2. Push the update to Azure:

PowerShell
docker push toxapiayman.azurecr.io/tox-backend:v1
Step 3: Restart the Azure Container
Once the push hits 100%, tell Azure to reboot your container so it downloads your fresh code and applies the port fix:

PowerShell
az container restart --resource-group tox-api-rg-italy --name tox-api-container