This guide outlines a professional deployment lifecycle for your applications using the Google AntiGravity (GAG) IDE, Google CLI, and your Managed Cloud Platform (MCP).

---

### 1. The Environment Strategy: Dev vs. Prod
The most critical rule of production deployment is **environmental isolation.** Never deploy code directly to your production environment without testing it in a mirror environment.

*   **Development (Dev):** Your local GAG environment. This is where you write, test, and debug.
*   **Production (Prod):** An isolated project or workspace in MCP. It should have its own separate database, API keys, and service account permissions.

**Action Item:** Ensure you have two distinct project IDs (e.g., `my-app-dev` and `my-app-prod`). Use `gcloud config set project [PROJECT_ID]` to switch context.

---

### 2. The Initial Deployment (Going Live)
Before pushing, ensure your project is "Production Ready":

1.  **Hardening:** Remove debug logs, ensure `process.env.NODE_ENV` (or equivalent) is set to `production`, and verify that all secrets are pulled from **Secret Manager**, not local `.env` files.
2.  **Configuration:** Ensure your `app.yaml` or `mcp-config.json` is configured for production scaling (e.g., instance sizing, region settings).
3.  **The Push:** 
    ```bash
    # Set context to Prod
    gcloud config set project [PROD_PROJECT_ID]
    
    # Run the deployment command
    mcp deploy --target=production --version=v1.0.0
    ```

---

### 3. The Update Loop (The Deployment Pipeline)
To push updates without downtime, you must treat your deployments as "atomic versions." 

1.  **Local Commit:** Push your changes to your version control (Git) from GAG.
2.  **Test:** Deploy to your Dev environment first:
    ```bash
    gcloud config set project [DEV_PROJECT_ID]
    mcp deploy --target=development
    ```
3.  **The Live Update:** Once verified, switch to the Prod context:
    ```bash
    gcloud config set project [PROD_PROJECT_ID]
    
    # Deploying a new version will spin up the new code 
    # and traffic will shift once it passes health checks
    mcp deploy --target=production --version=v1.0.1
    ```

---

### 4. Best Practices for Professional Maintenance

#### Versioning
*   **Semantic Versioning (SemVer):** Use a `MAJOR.MINOR.PATCH` format. Tag your versions in your git repo corresponding to the version deployed via CLI.
*   **Build Tags:** When running `mcp deploy`, always include a version flag. This allows you to identify exactly which version is currently running in the dashboard.

#### Handling Secrets
*   **Never Hardcode:** Even in dev, use Secret Manager.
*   **Grant Access:** Ensure the Service Account assigned to your MCP app has `Secret Manager Secret Accessor` roles for the specific production secrets.

#### Rollbacks (The Safety Net)
If a deployment breaks your app, you need to revert immediately. Most Google-based deployment platforms keep previous versions active.

*   **List existing versions:** 
    ```bash
    gcloud app versions list --project=[PROD_PROJECT_ID]
    ```
*   **Roll back traffic:** 
    ```bash
    # Shift traffic back to the previous stable version
    gcloud app services set-traffic [SERVICE_NAME] --splits=[VERSION_ID]=1
    ```

---

### Summary Checklist for Every Update
1. [ ] **Git:** Changes committed and pushed to the main branch.
2. [ ] **Dev Test:** Verified changes in the `dev` environment.
3. [ ] **Config:** Updated `version` in the deployment manifest.
4. [ ] **Context Check:** Verified `gcloud config get-value project` returns the **Production** ID.
5. [ ] **Deploy:** Executed `mcp deploy`.
6. [ ] **Smoke Test:** Checked the production URL to ensure the app is responding correctly.

**Pro-Tip:** If you find yourself doing this frequently, look into setting up a simple GitHub Action or Cloud Build trigger. This would automate the "build and push" steps so that simply merging to your `main` branch automatically triggers the `mcp deploy` command.