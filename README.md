# dc-extension-unsplash-demo

This project demonstrates the use of the [dc-extensions-sdk](https://github.com/amplience/dc-extensions-sdk), enabling the creation of custom extensions for Dynamic Content. Extensions are custom form controls used within the content editing interface of the Dynamic Content platform.

This extension is a React application that integrates with the [Unsplash API](https://unsplash.com/documentation#getting-started) to display images within an Amplience Content Item. Users can select an image and save its associated URL and alt text values.

Additionally, the extension includes a search functionality that allows users to find images based on specific keywords.

## Features

- Fetches a set of random images from the Unsplash API.
- Allows users to select an image and save its associated URL and alt text.
- Provides a search functionality for finding images based on keywords.
- Automatically updates URL and alt text values when a new image is selected.

## Deployment

To use this extension, you must first fork this repository and deploy the application to a hosting provider such as Netlify, Vercel, or a similar platform. 

**Important:** The extension is designed to work specifically within Amplience as an integrated extension and requires a valid Unsplash API Key for functionality.

## Installation

After deploying the application, follow these steps to integrate it with Amplience:

1. **Create and Configure a New Extension**  
   Register the app as an extension in the Amplience platform.

2. **Create a new Schema**
   Create a new schema that uses the extension

3. **Create a Content Type**  
   Define a Content Type that incorporates the newly created extension.

4. **Create a Content Item**  
   Build a Content Item using the Content Type configured in the previous step.

For detailed instructions on registering and using a new extension, refer to the [Amplience documentation](https://amplience.com/developers/docs/integrations/extensions/register-use/).

## Create and Configure a New Extension

### Setup

![Extension Setup](assets/setup.png)

### Required Permissions

Assign the following permissions to ensure the extension functions correctly:

![permissions](assets/permissions.png)

## Installation Parameters

When registering the extension, add your Unsplash API key to the Installation Parameters to enable API access. 

```{
  "api_key": "YOUR API KEY",
}
```

## Create a new Schema and Content Type
Follow the instruction here to [Creating a Content Type](https://amplience.com/developers/docs/start/model/#creating-the-content-type) and use the following code when creating the new schema. 

```
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "https://joe-demo.com/unsplash-demo/",


    "title": "Title",
    "description": "Description",


    "allOf": [
        {
            "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/content"
        }
    ],
    
    "type": "object",
    "properties": {
        "image": {
            "title": "Unsplash Image",
            "type": "object",
            "properties": {
                "url": {
                    "title": "URL",
                    "description": "URL for the image",
                    "type": "string"
                },
                "alt_description": {
                    "title": "Description",
                    "description": "Id (the image name)",
                    "type": "string"
                }
            },
            "ui:extension": {
                "name": "unsplash-demo"
            },
            "propertyOrder": []
        }
        
    },
    "propertyOrder": []
}
```
