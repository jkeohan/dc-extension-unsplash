# dc-extension-unsplash-demo

The app makes use of the [dc-extensions-sdk](https://github.com/amplience/dc-extensions-sdk) which enables the creation of Extensions for Dynamic Content. Extensions are custom form controls that can be used in the content editing form in the Dynamic Content App.

This extension is a simple React app that leverages the [Unsplash API](https://unsplash.com/documentation#getting-started) to render images within an Amplience Content Item.  The user then has the ability to select an image and save its corresponding url and alt text values.  

A search input field is provided which allows the user to search images using specific keywords. 

## Features

* Retrieves a set of images from Unsplash API
* Allows user to select an image and save its corresponding url and alt text values
* Allows the user to search for images based on keywords
* Updates url and alt text values when a new image has been saved

# Deployment

After you fork the project you must deploy the app to a hosting provider such as Netlify, Vercel, ect.  Keep in mind that the app performs only as expected only when used within the context of an Amplience extension and requires a valid Unsplash API Key. 


# Installation

Once the app has been deployed you will perform the following:

1. Create a and configure a new extension
2. Create a Content Type that uses the extension
3. Create a Content Item based on this Content Type.

# Register and use the extension

Review the [official documentation for registering a new extension](https://amplience.com/developers/docs/integrations/extensions/register-use/)

# Required Persmissions

Assign the following permissions:

