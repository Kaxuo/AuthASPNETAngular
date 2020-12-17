using System;
using System.Threading.Tasks;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Data
{
    public class AppSettings
    {
        public string Secret { get; set; }

        public async Task<string> GetKey()
        {
            string secret = "TBD";

            var secretClient = new SecretClient(new Uri("https://vaultsecretkey.vault.azure.net/"), new DefaultAzureCredential());
            secret = (await secretClient.GetSecretAsync("Secret")).Value.Value;

            return secret;
        }
    }
}