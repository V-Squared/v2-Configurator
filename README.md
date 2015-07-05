# v2-Configurator ReadMe
This is to get you started. We are working on the WikiPages.

# A Demo says more than a 1000 words
[Demo of V²Configurator on GitHub Pages](http://v-squared.github.io/v2-Configurator/)

# Who needs it
- Who runs a site selling stuff with customization options

# What it does
You want to assist your visitor in choosing configuration options. Each option may have lots of information, such as pictures, data sheet, recommendations, etc. Say some option have dependencies, e.g. you pick the small case and then the big heat sink option is disabled, as it does not fit. Say when the customer is done with the configuration, he wants to see his shopping list as a result. For convenience reason you may even include third party products if required to build a complete configuration.

# License and Collaboration
GNU GPL V2. It means you can use it for your private and commercial projects at no cost. You are encouraged to make improvements to the code. In the words of Linus Torvalds: You are invited to take from this Community and in return you need to give back. If you make improvements of general use, please be so kind to do so by GitHub Fork and subsequent Pull Request. We will work with you to include your new feature. This will also safe you time down the road. Once we come out with a new version and a feature you like, you do not need to add your improvement again.


# Key Features

## Full customization without coding
- Company Name, Logo, Product Names, Data Sheet content, etc... all can be customized for your needs in one Jason file
- You can use a WYSIWYG Json form editor. No programming skill needed. If you can fill out a form on the internet, you can customize V²Configurator

## Customizable Configurator Logic without programming
One purpose of the configurator is to guide the customer to only configure sensible configurations. E.g. do not offer the choice of the big heat sink in case the customer chose the tiny housing (in which the big heat sink does not fit). Logic in a configurator is about limiting choices in a section depending on its parents choices. You can configure these dependencies as a look up table by simply adding this look up table data to your section's JSON data. You do not nee to code JavaScript by hand!

## Lightweight
- Just a HTML file with additional CSS and JavaScript. 
- No PHP, No SQL Server
- No CPU load on server. Computations are done on Client

## Easy to Install
If you can copy a custom HTML page with linked JavaScript and CSS to your server then you can install V²Configurator.

## Compatible to common Web Site Technologies
### Joomla
![](http://www.mindk.com/images/icon-joomla.png)

### WordPress
![](https://jquery.org/resources/home/wordpress-logo.png)

### Static HTML (Responsive)
![](http://www.digitalst.co.il/files/upload/html5%2Bcss3%2Bjavascript%2Bresponsive%2Bicon-logo.png)

### GitHub Pages
![](http://doc.rultor.com/images/github-logo.png)

## Build in Gallery
Simple Gallery to show pictures per part

## Responsive design
- Runs on any screen size, from 3.5" Mobile to big screen
- Luxury features are automatically disabled on small screens
- modules flow automatically according to screen size

## Ready Made Configurations
Common Configurations can be stored in Json by the admin. The user can create very complex configurations with the click of just one button or by answering a short series of questions. 

## Flexible, common structure
- Configurator Hierarchy: Product ►Part ►Option
- Part Sub Sections (each can be disabled)
   1) Choice
   2) Comparison Table
   3) Advice
   4) Gallery
   5) Datasheet


# Technologies

## jQuery
![](https://developer.blackberry.com/html5/files/documentation/v2_2/images/jquery_logo.png)
→ https://jquery.com/

## Angular
![](https://angularjs.org/img/AngularJS-large.png)
→ https://angularjs.org/

## Json
![](http://antonioortegajr.com/wp-content/uploads/logo_json.png)
→ http://json.org/


# Installation
1. Download the Master Branch
2. Copy the files to your server and proper link the paths
   - You should be able to have your copy running after 10 minutes (without customization)
4. All customization is done in one Json file. Changes can be done with a Jason Form Editor. Files are not very big.  No coding skills needed for customization.

# Reference
- [Trello►configurator-read-me-on-github](https://trello.com/c/5FJp4i9Y/66-configurator-read-me-on-github)

