(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tinymce/tinymce'), require('tinymce/themes/silver/theme'), require('@tinymce/tinymce-vue'), require('tinymce/plugins/code'), require('tinymce/plugins/table'), require('tinymce/plugins/lists'), require('tinymce/plugins/wordcount'), require('tinymce/plugins/image'), require('tinymce/plugins/link'), require('tinymce/plugins/fullscreen'), require('tinymce/plugins/preview'), require('tinymce/skins/ui/oxide/skin.min.css'), require('vue')) :
    typeof define === 'function' && define.amd ? define(['exports', 'tinymce/tinymce', 'tinymce/themes/silver/theme', '@tinymce/tinymce-vue', 'tinymce/plugins/code', 'tinymce/plugins/table', 'tinymce/plugins/lists', 'tinymce/plugins/wordcount', 'tinymce/plugins/image', 'tinymce/plugins/link', 'tinymce/plugins/fullscreen', 'tinymce/plugins/preview', 'tinymce/skins/ui/oxide/skin.min.css', 'vue'], factory) :
    (global = global || self, factory(global.tinymce = {}, global.tinymce$1, null, global.Editor, null, null, null, null, null, null, null, null, null, global.Vue));
}(this, (function (exports, tinymce$1, theme, Editor, code, table, lists, wordcount, image, link, fullscreen, preview, skin_min_css, Vue) { 'use strict';

    tinymce$1 = tinymce$1 && Object.prototype.hasOwnProperty.call(tinymce$1, 'default') ? tinymce$1['default'] : tinymce$1;
    Editor = Editor && Object.prototype.hasOwnProperty.call(Editor, 'default') ? Editor['default'] : Editor;
    Vue = Vue && Object.prototype.hasOwnProperty.call(Vue, 'default') ? Vue['default'] : Vue;

    /*eslint-disable*/
    tinymce.addI18n("zh_CN", {
        "Redo": "\u91cd\u505a",
        "Undo": "\u64a4\u9500",
        "Cut": "\u526a\u5207",
        "Copy": "\u590d\u5236",
        "Paste": "\u7c98\u8d34",
        "Select all": "\u5168\u9009",
        "New document": "\u65b0\u6587\u4ef6",
        "Ok": "\u786e\u5b9a",
        "Cancel": "\u53d6\u6d88",
        "Visual aids": "\u7f51\u683c\u7ebf",
        "Bold": "\u7c97\u4f53",
        "Italic": "\u659c\u4f53",
        "Underline": "\u4e0b\u5212\u7ebf",
        "Strikethrough": "\u5220\u9664\u7ebf",
        "Superscript": "\u4e0a\u6807",
        "Subscript": "\u4e0b\u6807",
        "Clear formatting": "\u6e05\u9664\u683c\u5f0f",
        "Align left": "\u5de6\u8fb9\u5bf9\u9f50",
        "Align center": "\u4e2d\u95f4\u5bf9\u9f50",
        "Align right": "\u53f3\u8fb9\u5bf9\u9f50",
        "Justify": "\u4e24\u7aef\u5bf9\u9f50",
        "Bullet list": "\u9879\u76ee\u7b26\u53f7",
        "Numbered list": "\u7f16\u53f7\u5217\u8868",
        "Decrease indent": "\u51cf\u5c11\u7f29\u8fdb",
        "Increase indent": "\u589e\u52a0\u7f29\u8fdb",
        "Close": "\u5173\u95ed",
        "Formats": "\u683c\u5f0f",
        "Your browser doesn't support direct access to the clipboard. Please use the Ctrl+X\/C\/V keyboard shortcuts instead.": "\u4f60\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u6253\u5f00\u526a\u8d34\u677f\uff0c\u8bf7\u4f7f\u7528Ctrl+X\/C\/V\u7b49\u5feb\u6377\u952e\u3002",
        "Headers": "\u6807\u9898",
        "Header 1": "\u6807\u98981",
        "Header 2": "\u6807\u98982",
        "Header 3": "\u6807\u98983",
        "Header 4": "\u6807\u98984",
        "Header 5": "\u6807\u98985",
        "Header 6": "\u6807\u98986",
        "Headings": "\u6807\u9898",
        "Heading 1": "\u6807\u98981",
        "Heading 2": "\u6807\u98982",
        "Heading 3": "\u6807\u98983",
        "Heading 4": "\u6807\u98984",
        "Heading 5": "\u6807\u98985",
        "Heading 6": "\u6807\u98986",
        "Preformatted": "\u9884\u5148\u683c\u5f0f\u5316\u7684",
        "Div": "Div",
        "Pre": "Pre",
        "Code": "\u4ee3\u7801",
        "Paragraph": "\u6bb5\u843d",
        "Blockquote": "\u5f15\u6587\u533a\u5757",
        "Inline": "\u6587\u672c",
        "Blocks": "\u57fa\u5757",
        "Paste is now in plain text mode. Contents will now be pasted as plain text until you toggle this option off.": "\u5f53\u524d\u4e3a\u7eaf\u6587\u672c\u7c98\u8d34\u6a21\u5f0f\uff0c\u518d\u6b21\u70b9\u51fb\u53ef\u4ee5\u56de\u5230\u666e\u901a\u7c98\u8d34\u6a21\u5f0f\u3002",
        "Fonts": "\u5b57\u4f53",
        "Font Sizes": "\u5b57\u53f7",
        "Class": "\u7c7b\u578b",
        "Browse for an image": "\u6d4f\u89c8\u56fe\u50cf",
        "OR": "\u6216",
        "Drop an image here": "\u62d6\u653e\u4e00\u5f20\u56fe\u50cf\u81f3\u6b64",
        "Upload": "\u4e0a\u4f20",
        "Block": "\u5757",
        "Align": "\u5bf9\u9f50",
        "Default": "\u9ed8\u8ba4",
        "Circle": "\u7a7a\u5fc3\u5706",
        "Disc": "\u5b9e\u5fc3\u5706",
        "Square": "\u65b9\u5757",
        "Lower Alpha": "\u5c0f\u5199\u82f1\u6587\u5b57\u6bcd",
        "Lower Greek": "\u5c0f\u5199\u5e0c\u814a\u5b57\u6bcd",
        "Lower Roman": "\u5c0f\u5199\u7f57\u9a6c\u5b57\u6bcd",
        "Upper Alpha": "\u5927\u5199\u82f1\u6587\u5b57\u6bcd",
        "Upper Roman": "\u5927\u5199\u7f57\u9a6c\u5b57\u6bcd",
        "Anchor...": "\u951a\u70b9...",
        "Name": "\u540d\u79f0",
        "Id": "\u6807\u8bc6\u7b26",
        "Id should start with a letter, followed only by letters, numbers, dashes, dots, colons or underscores.": "\u6807\u8bc6\u7b26\u5e94\u8be5\u4ee5\u5b57\u6bcd\u5f00\u5934\uff0c\u540e\u8ddf\u5b57\u6bcd\u3001\u6570\u5b57\u3001\u7834\u6298\u53f7\u3001\u70b9\u3001\u5192\u53f7\u6216\u4e0b\u5212\u7ebf\u3002",
        "You have unsaved changes are you sure you want to navigate away?": "\u4f60\u8fd8\u6709\u6587\u6863\u5c1a\u672a\u4fdd\u5b58\uff0c\u786e\u5b9a\u8981\u79bb\u5f00\uff1f",
        "Restore last draft": "\u6062\u590d\u4e0a\u6b21\u7684\u8349\u7a3f",
        "Special characters...": "\u7279\u6b8a\u5b57\u7b26...",
        "Source code": "\u6e90\u4ee3\u7801",
        "Insert\/Edit code sample": "\u63d2\u5165\/\u7f16\u8f91\u4ee3\u7801\u793a\u4f8b",
        "Language": "\u8bed\u8a00",
        "Code sample...": "\u793a\u4f8b\u4ee3\u7801...",
        "Color Picker": "\u9009\u8272\u5668",
        "R": "R",
        "G": "G",
        "B": "B",
        "Left to right": "\u4ece\u5de6\u5230\u53f3",
        "Right to left": "\u4ece\u53f3\u5230\u5de6",
        "Emoticons...": "\u8868\u60c5\u7b26\u53f7...",
        "Metadata and Document Properties": "\u5143\u6570\u636e\u548c\u6587\u6863\u5c5e\u6027",
        "Title": "\u6807\u9898",
        "Keywords": "\u5173\u952e\u8bcd",
        "Description": "\u63cf\u8ff0",
        "Robots": "\u673a\u5668\u4eba",
        "Author": "\u4f5c\u8005",
        "Encoding": "\u7f16\u7801",
        "Fullscreen": "\u5168\u5c4f",
        "Action": "\u64cd\u4f5c",
        "Shortcut": "\u5feb\u6377\u952e",
        "Help": "\u5e2e\u52a9",
        "Address": "\u5730\u5740",
        "Focus to menubar": "\u79fb\u52a8\u7126\u70b9\u5230\u83dc\u5355\u680f",
        "Focus to toolbar": "\u79fb\u52a8\u7126\u70b9\u5230\u5de5\u5177\u680f",
        "Focus to element path": "\u79fb\u52a8\u7126\u70b9\u5230\u5143\u7d20\u8def\u5f84",
        "Focus to contextual toolbar": "\u79fb\u52a8\u7126\u70b9\u5230\u4e0a\u4e0b\u6587\u83dc\u5355",
        "Insert link (if link plugin activated)": "\u63d2\u5165\u94fe\u63a5 (\u5982\u679c\u94fe\u63a5\u63d2\u4ef6\u5df2\u6fc0\u6d3b)",
        "Save (if save plugin activated)": "\u4fdd\u5b58(\u5982\u679c\u4fdd\u5b58\u63d2\u4ef6\u5df2\u6fc0\u6d3b)",
        "Find (if searchreplace plugin activated)": "\u67e5\u627e(\u5982\u679c\u67e5\u627e\u66ff\u6362\u63d2\u4ef6\u5df2\u6fc0\u6d3b)",
        "Plugins installed ({0}):": "\u5df2\u5b89\u88c5\u63d2\u4ef6 ({0}):",
        "Premium plugins:": "\u4f18\u79c0\u63d2\u4ef6\uff1a",
        "Learn more...": "\u4e86\u89e3\u66f4\u591a...",
        "You are using {0}": "\u4f60\u6b63\u5728\u4f7f\u7528 {0}",
        "Plugins": "\u63d2\u4ef6",
        "Handy Shortcuts": "\u5feb\u6377\u952e",
        "Horizontal line": "\u6c34\u5e73\u5206\u5272\u7ebf",
        "Insert\/edit image": "\u63d2\u5165\/\u7f16\u8f91\u56fe\u7247",
        "Image description": "\u56fe\u7247\u63cf\u8ff0",
        "Source": "\u5730\u5740",
        "Dimensions": "\u5927\u5c0f",
        "Constrain proportions": "\u4fdd\u6301\u7eb5\u6a2a\u6bd4",
        "General": "\u666e\u901a",
        "Advanced": "\u9ad8\u7ea7",
        "Style": "\u6837\u5f0f",
        "Vertical space": "\u5782\u76f4\u8fb9\u8ddd",
        "Horizontal space": "\u6c34\u5e73\u8fb9\u8ddd",
        "Border": "\u8fb9\u6846",
        "Insert image": "\u63d2\u5165\u56fe\u7247",
        "Image...": "\u56fe\u7247...",
        "Image list": "\u56fe\u7247\u5217\u8868",
        "Rotate counterclockwise": "\u9006\u65f6\u9488\u65cb\u8f6c",
        "Rotate clockwise": "\u987a\u65f6\u9488\u65cb\u8f6c",
        "Flip vertically": "\u5782\u76f4\u7ffb\u8f6c",
        "Flip horizontally": "\u6c34\u5e73\u7ffb\u8f6c",
        "Edit image": "\u7f16\u8f91\u56fe\u7247",
        "Image options": "\u56fe\u7247\u9009\u9879",
        "Zoom in": "\u653e\u5927",
        "Zoom out": "\u7f29\u5c0f",
        "Crop": "\u88c1\u526a",
        "Resize": "\u8c03\u6574\u5927\u5c0f",
        "Orientation": "\u65b9\u5411",
        "Brightness": "\u4eae\u5ea6",
        "Sharpen": "\u9510\u5316",
        "Contrast": "\u5bf9\u6bd4\u5ea6",
        "Color levels": "\u989c\u8272\u5c42\u6b21",
        "Gamma": "\u4f3d\u9a6c\u503c",
        "Invert": "\u53cd\u8f6c",
        "Apply": "\u5e94\u7528",
        "Back": "\u540e\u9000",
        "Insert date\/time": "\u63d2\u5165\u65e5\u671f\/\u65f6\u95f4",
        "Date\/time": "\u65e5\u671f\/\u65f6\u95f4",
        "Insert\/Edit Link": "\u63d2\u5165\/\u7f16\u8f91\u94fe\u63a5",
        "Insert\/edit link": "\u63d2\u5165\/\u7f16\u8f91\u94fe\u63a5",
        "Text to display": "\u663e\u793a\u6587\u5b57",
        "Url": "\u5730\u5740",
        "Open link in...": "\u94fe\u63a5\u6253\u5f00\u4f4d\u7f6e...",
        "Current window": "\u5f53\u524d\u7a97\u53e3",
        "None": "\u65e0",
        "New window": "\u5728\u65b0\u7a97\u53e3\u6253\u5f00",
        "Remove link": "\u5220\u9664\u94fe\u63a5",
        "Anchors": "\u951a\u70b9",
        "Link...": "\u94fe\u63a5...",
        "Paste or type a link": "\u7c98\u8d34\u6216\u8f93\u5165\u94fe\u63a5",
        "The URL you entered seems to be an email address. Do you want to add the required mailto: prefix?": "\u4f60\u6240\u586b\u5199\u7684URL\u5730\u5740\u4e3a\u90ae\u4ef6\u5730\u5740\uff0c\u9700\u8981\u52a0\u4e0amailto:\u524d\u7f00\u5417\uff1f",
        "The URL you entered seems to be an external link. Do you want to add the required http:\/\/ prefix?": "\u4f60\u6240\u586b\u5199\u7684URL\u5730\u5740\u5c5e\u4e8e\u5916\u90e8\u94fe\u63a5\uff0c\u9700\u8981\u52a0\u4e0ahttp:\/\/:\u524d\u7f00\u5417\uff1f",
        "Link list": "\u94fe\u63a5\u5217\u8868",
        "Insert video": "\u63d2\u5165\u89c6\u9891",
        "Insert\/edit video": "\u63d2\u5165\/\u7f16\u8f91\u89c6\u9891",
        "Insert\/edit media": "\u63d2\u5165\/\u7f16\u8f91\u5a92\u4f53",
        "Alternative source": "\u955c\u50cf",
        "Alternative source URL": "\u66ff\u4ee3\u6765\u6e90\u7f51\u5740",
        "Media poster (Image URL)": "\u5c01\u9762(\u56fe\u7247\u5730\u5740)",
        "Paste your embed code below:": "\u5c06\u5185\u5d4c\u4ee3\u7801\u7c98\u8d34\u5728\u4e0b\u9762:",
        "Embed": "\u5185\u5d4c",
        "Media...": "\u591a\u5a92\u4f53...",
        "Nonbreaking space": "\u4e0d\u95f4\u65ad\u7a7a\u683c",
        "Page break": "\u5206\u9875\u7b26",
        "Paste as text": "\u7c98\u8d34\u4e3a\u6587\u672c",
        "Preview": "\u9884\u89c8",
        "Print...": "\u6253\u5370...",
        "Save": "\u4fdd\u5b58",
        "Find": "\u67e5\u627e",
        "Replace with": "\u66ff\u6362\u4e3a",
        "Replace": "\u66ff\u6362",
        "Replace all": "\u5168\u90e8\u66ff\u6362",
        "Previous": "\u4e0a\u4e00\u4e2a",
        "Next": "\u4e0b\u4e00\u4e2a",
        "Find and replace...": "\u67e5\u627e\u5e76\u66ff\u6362...",
        "Could not find the specified string.": "\u672a\u627e\u5230\u641c\u7d22\u5185\u5bb9.",
        "Match case": "\u533a\u5206\u5927\u5c0f\u5199",
        "Find whole words only": "\u5168\u5b57\u5339\u914d",
        "Spell check": "\u62fc\u5199\u68c0\u67e5",
        "Ignore": "\u5ffd\u7565",
        "Ignore all": "\u5168\u90e8\u5ffd\u7565",
        "Finish": "\u5b8c\u6210",
        "Add to Dictionary": "\u6dfb\u52a0\u5230\u5b57\u5178",
        "Insert table": "\u63d2\u5165\u8868\u683c",
        "Table properties": "\u8868\u683c\u5c5e\u6027",
        "Delete table": "\u5220\u9664\u8868\u683c",
        "Cell": "\u5355\u5143\u683c",
        "Row": "\u884c",
        "Column": "\u5217",
        "Cell properties": "\u5355\u5143\u683c\u5c5e\u6027",
        "Merge cells": "\u5408\u5e76\u5355\u5143\u683c",
        "Split cell": "\u62c6\u5206\u5355\u5143\u683c",
        "Insert row before": "\u5728\u4e0a\u65b9\u63d2\u5165",
        "Insert row after": "\u5728\u4e0b\u65b9\u63d2\u5165",
        "Delete row": "\u5220\u9664\u884c",
        "Row properties": "\u884c\u5c5e\u6027",
        "Cut row": "\u526a\u5207\u884c",
        "Copy row": "\u590d\u5236\u884c",
        "Paste row before": "\u7c98\u8d34\u5230\u4e0a\u65b9",
        "Paste row after": "\u7c98\u8d34\u5230\u4e0b\u65b9",
        "Insert column before": "\u5728\u5de6\u4fa7\u63d2\u5165",
        "Insert column after": "\u5728\u53f3\u4fa7\u63d2\u5165",
        "Delete column": "\u5220\u9664\u5217",
        "Cols": "\u5217",
        "Rows": "\u884c",
        "Width": "\u5bbd",
        "Height": "\u9ad8",
        "Cell spacing": "\u5355\u5143\u683c\u5916\u95f4\u8ddd",
        "Cell padding": "\u5355\u5143\u683c\u5185\u8fb9\u8ddd",
        "Show caption": "\u663e\u793a\u6807\u9898",
        "Left": "\u5de6\u5bf9\u9f50",
        "Center": "\u5c45\u4e2d",
        "Right": "\u53f3\u5bf9\u9f50",
        "Cell type": "\u5355\u5143\u683c\u7c7b\u578b",
        "Scope": "\u8303\u56f4",
        "Alignment": "\u5bf9\u9f50\u65b9\u5f0f",
        "H Align": "\u6c34\u5e73\u5bf9\u9f50",
        "V Align": "\u5782\u76f4\u5bf9\u9f50",
        "Top": "\u9876\u90e8\u5bf9\u9f50",
        "Middle": "\u5782\u76f4\u5c45\u4e2d",
        "Bottom": "\u5e95\u90e8\u5bf9\u9f50",
        "Header cell": "\u8868\u5934\u5355\u5143\u683c",
        "Row group": "\u884c\u7ec4",
        "Column group": "\u5217\u7ec4",
        "Row type": "\u884c\u7c7b\u578b",
        "Header": "\u8868\u5934",
        "Body": "\u8868\u4f53",
        "Footer": "\u8868\u5c3e",
        "Border color": "\u8fb9\u6846\u989c\u8272",
        "Insert template...": "\u63d2\u5165\u6a21\u677f...",
        "Templates": "\u6a21\u677f",
        "Template": "\u6a21\u677f",
        "Text color": "\u6587\u5b57\u989c\u8272",
        "Background color": "\u80cc\u666f\u8272",
        "Custom...": "\u81ea\u5b9a\u4e49...",
        "Custom color": "\u81ea\u5b9a\u4e49\u989c\u8272",
        "No color": "\u65e0",
        "Remove color": "\u79fb\u9664\u989c\u8272",
        "Table of Contents": "\u5185\u5bb9\u5217\u8868",
        "Show blocks": "\u663e\u793a\u533a\u5757\u8fb9\u6846",
        "Show invisible characters": "\u663e\u793a\u4e0d\u53ef\u89c1\u5b57\u7b26",
        "Word count": "\u5b57\u6570",
        "Words: {0}": "\u5b57\u6570\uff1a{0}",
        "{0} words": "{0} \u5b57",
        "File": "\u6587\u4ef6",
        "Edit": "\u7f16\u8f91",
        "Insert": "\u63d2\u5165",
        "View": "\u89c6\u56fe",
        "Format": "\u683c\u5f0f",
        "Table": "\u8868\u683c",
        "Tools": "\u5de5\u5177",
        "Powered by {0}": "\u7531{0}\u9a71\u52a8",
        "Rich Text Area. Press ALT-F9 for menu. Press ALT-F10 for toolbar. Press ALT-0 for help": "\u5728\u7f16\u8f91\u533a\u6309ALT-F9\u6253\u5f00\u83dc\u5355\uff0c\u6309ALT-F10\u6253\u5f00\u5de5\u5177\u680f\uff0c\u6309ALT-0\u67e5\u770b\u5e2e\u52a9",
        "Image title": "\u56fe\u7247\u6807\u9898",
        "Border width": "\u8fb9\u6846\u5bbd\u5ea6",
        "Border style": "\u8fb9\u6846\u6837\u5f0f",
        "Error": "\u9519\u8bef",
        "Warn": "\u8b66\u544a",
        "Valid": "\u6709\u6548",
        "To open the popup, press Shift+Enter": "\u6309Shitf+Enter\u952e\u6253\u5f00\u5bf9\u8bdd\u6846",
        "Rich Text Area. Press ALT-0 for help.": "\u7f16\u8f91\u533a\u3002\u6309Alt+0\u952e\u6253\u5f00\u5e2e\u52a9\u3002",
        "System Font": "\u7cfb\u7edf\u5b57\u4f53",
        "Failed to upload image: {0}": "\u56fe\u7247\u4e0a\u4f20\u5931\u8d25: {0}",
        "Failed to load plugin: {0} from url {1}": "\u63d2\u4ef6\u52a0\u8f7d\u5931\u8d25: {0} \u6765\u81ea\u94fe\u63a5 {1}",
        "Failed to load plugin url: {0}": "\u63d2\u4ef6\u52a0\u8f7d\u5931\u8d25 \u94fe\u63a5: {0}",
        "Failed to initialize plugin: {0}": "\u63d2\u4ef6\u521d\u59cb\u5316\u5931\u8d25: {0}",
        "example": "\u793a\u4f8b",
        "Search": "\u641c\u7d22",
        "All": "\u5168\u90e8",
        "Currency": "\u8d27\u5e01",
        "Text": "\u6587\u5b57",
        "Quotations": "\u5f15\u7528",
        "Mathematical": "\u6570\u5b66",
        "Extended Latin": "\u62c9\u4e01\u8bed\u6269\u5145",
        "Symbols": "\u7b26\u53f7",
        "Arrows": "\u7bad\u5934",
        "User Defined": "\u81ea\u5b9a\u4e49",
        "dollar sign": "\u7f8e\u5143\u7b26\u53f7",
        "currency sign": "\u8d27\u5e01\u7b26\u53f7",
        "euro-currency sign": "\u6b27\u5143\u7b26\u53f7",
        "colon sign": "\u5192\u53f7",
        "cruzeiro sign": "\u514b\u9c81\u8d5b\u7f57\u5e01\u7b26\u53f7",
        "french franc sign": "\u6cd5\u90ce\u7b26\u53f7",
        "lira sign": "\u91cc\u62c9\u7b26\u53f7",
        "mill sign": "\u5bc6\u5c14\u7b26\u53f7",
        "naira sign": "\u5948\u62c9\u7b26\u53f7",
        "peseta sign": "\u6bd4\u585e\u5854\u7b26\u53f7",
        "rupee sign": "\u5362\u6bd4\u7b26\u53f7",
        "won sign": "\u97e9\u5143\u7b26\u53f7",
        "new sheqel sign": "\u65b0\u8c22\u514b\u5c14\u7b26\u53f7",
        "dong sign": "\u8d8a\u5357\u76fe\u7b26\u53f7",
        "kip sign": "\u8001\u631d\u57fa\u666e\u7b26\u53f7",
        "tugrik sign": "\u56fe\u683c\u91cc\u514b\u7b26\u53f7",
        "drachma sign": "\u5fb7\u62c9\u514b\u9a6c\u7b26\u53f7",
        "german penny symbol": "\u5fb7\u56fd\u4fbf\u58eb\u7b26\u53f7",
        "peso sign": "\u6bd4\u7d22\u7b26\u53f7",
        "guarani sign": "\u74dc\u62c9\u5c3c\u7b26\u53f7",
        "austral sign": "\u6fb3\u5143\u7b26\u53f7",
        "hryvnia sign": "\u683c\u91cc\u592b\u5c3c\u4e9a\u7b26\u53f7",
        "cedi sign": "\u585e\u5730\u7b26\u53f7",
        "livre tournois sign": "\u91cc\u5f17\u5f17\u5c14\u7b26\u53f7",
        "spesmilo sign": "spesmilo\u7b26\u53f7",
        "tenge sign": "\u575a\u6208\u7b26\u53f7",
        "indian rupee sign": "\u5370\u5ea6\u5362\u6bd4",
        "turkish lira sign": "\u571f\u8033\u5176\u91cc\u62c9",
        "nordic mark sign": "\u5317\u6b27\u9a6c\u514b",
        "manat sign": "\u9a6c\u7eb3\u7279\u7b26\u53f7",
        "ruble sign": "\u5362\u5e03\u7b26\u53f7",
        "yen character": "\u65e5\u5143\u5b57\u6837",
        "yuan character": "\u4eba\u6c11\u5e01\u5143\u5b57\u6837",
        "yuan character, in hong kong and taiwan": "\u5143\u5b57\u6837\uff08\u6e2f\u53f0\u5730\u533a\uff09",
        "yen\/yuan character variant one": "\u5143\u5b57\u6837\uff08\u5927\u5199\uff09",
        "Loading emoticons...": "\u52a0\u8f7d\u8868\u60c5\u7b26\u53f7...",
        "Could not load emoticons": "\u4e0d\u80fd\u52a0\u8f7d\u8868\u60c5\u7b26\u53f7",
        "People": "\u4eba\u7c7b",
        "Animals and Nature": "\u52a8\u7269\u548c\u81ea\u7136",
        "Food and Drink": "\u98df\u7269\u548c\u996e\u54c1",
        "Activity": "\u6d3b\u52a8",
        "Travel and Places": "\u65c5\u6e38\u548c\u5730\u70b9",
        "Objects": "\u7269\u4ef6",
        "Flags": "\u65d7\u5e1c",
        "Characters": "\u5b57\u7b26",
        "Characters (no spaces)": "\u5b57\u7b26(\u65e0\u7a7a\u683c)",
        "Error: Form submit field collision.": "\u9519\u8bef: \u8868\u5355\u63d0\u4ea4\u5b57\u6bb5\u51b2\u7a81\u3002",
        "Error: No form element found.": "\u9519\u8bef: \u6ca1\u6709\u8868\u5355\u63a7\u4ef6\u3002",
        "Update": "\u66f4\u65b0",
        "Color swatch": "\u989c\u8272\u6837\u672c",
        "Turquoise": "\u9752\u7eff\u8272",
        "Green": "\u7eff\u8272",
        "Blue": "\u84dd\u8272",
        "Purple": "\u7d2b\u8272",
        "Navy Blue": "\u6d77\u519b\u84dd",
        "Dark Turquoise": "\u6df1\u84dd\u7eff\u8272",
        "Dark Green": "\u6df1\u7eff\u8272",
        "Medium Blue": "\u4e2d\u84dd\u8272",
        "Medium Purple": "\u4e2d\u7d2b\u8272",
        "Midnight Blue": "\u6df1\u84dd\u8272",
        "Yellow": "\u9ec4\u8272",
        "Orange": "\u6a59\u8272",
        "Red": "\u7ea2\u8272",
        "Light Gray": "\u6d45\u7070\u8272",
        "Gray": "\u7070\u8272",
        "Dark Yellow": "\u6697\u9ec4\u8272",
        "Dark Orange": "\u6df1\u6a59\u8272",
        "Dark Red": "\u6df1\u7ea2\u8272",
        "Medium Gray": "\u4e2d\u7070\u8272",
        "Dark Gray": "\u6df1\u7070\u8272",
        "Black": "\u9ed1\u8272",
        "White": "\u767d\u8272",
        "Switch to or from fullscreen mode": "\u5207\u6362\u5168\u5c4f\u6a21\u5f0f",
        "Open help dialog": "\u6253\u5f00\u5e2e\u52a9\u5bf9\u8bdd\u6846",
        "history": "\u5386\u53f2",
        "styles": "\u6837\u5f0f",
        "formatting": "\u683c\u5f0f\u5316",
        "alignment": "\u5bf9\u9f50",
        "indentation": "\u7f29\u8fdb",
        "permanent pen": "\u8bb0\u53f7\u7b14",
        "comments": "\u5907\u6ce8",
        "Anchor": "\u951a\u70b9",
        "Special character": "\u7279\u6b8a\u7b26\u53f7",
        "Code sample": "\u4ee3\u7801\u793a\u4f8b",
        "Color": "\u989c\u8272",
        "Emoticons": "\u8868\u60c5",
        "Document properties": "\u6587\u6863\u5c5e\u6027",
        "Image": "\u56fe\u7247",
        "Insert link": "\u63d2\u5165\u94fe\u63a5",
        "Target": "\u6253\u5f00\u65b9\u5f0f",
        "Link": "\u94fe\u63a5",
        "Poster": "\u5c01\u9762",
        "Media": "\u5a92\u4f53",
        "Print": "\u6253\u5370",
        "Prev": "\u4e0a\u4e00\u4e2a",
        "Find and replace": "\u67e5\u627e\u548c\u66ff\u6362",
        "Whole words": "\u5168\u5b57\u5339\u914d",
        "Spellcheck": "\u62fc\u5199\u68c0\u67e5",
        "Caption": "\u6807\u9898",
        "Insert template": "\u63d2\u5165\u6a21\u677f"
    });

    var languageUrl = {};

    //
    var script = Vue.extend({
        props: {
            text: {},
            value: {},
            imageUploadUrl: {
                type: String
            },
            toolbar: {
                type: Object,
                default: null
            },
            validateEvent: {
                type: Boolean,
                default: true
            }
        },
        components: {
            Editor: Editor
        },
        watch: {
            value: {
                handler(val) {
                    this.setEditorHtml(val);
                },
                immediate: true,
                deep: true
            },
            editorHtml: {
                handler(val) {
                    this.handleEditorHtml(val);
                },
                immediate: true,
                deep: true
            }
        },
        data() {
            return {
                editorInit: {
                    selector: 'textarea',
                    language_url: languageUrl,
                    language: 'zh_CN',
                    // skin_url: skin_url, //样式放入public在index.html里引用
                    height: 300,
                    plugins: 'link lists image code table wordcount fullscreen preview',
                    menu: {},
                    toolbar:
                        this.toolbar ||
                        'fontselect fontsizeselect | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | removeformat | link unlink image | code fullscreen | newnote print preview',
                    branding: false,
                    convert_urls: false,
                    images_upload_url: this.imageUploadUrl,
                    font_formats:
                        "微软雅黑=微软雅黑,Microsoft YaHei;宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
                    automatic_uploads: true,
                    file_picker_types: 'image'
                },
                editorHtml: this.tinymceHtml
            }
        },
        mounted() {
            tinymce$1.init({});
        },
        methods: {
            getCleanText() {
                const $editor = this.$refs.editor;
                let text = this.editorHtml;
                if ($editor) {
                    text = $editor.editor.getContent({ format: 'text' });
                } else {
                    text = this.cleanHtml(text);
                }
                return text
            },
            cleanHtml(data) {
                let text = data;
                if (text) {
                    text = text.replace(/(\n)/g, '');
                    text = text.replace(/(\t)/g, '');
                    text = text.replace(/(\r)/g, '');
                    text = text.replace(/<\/?[^>]*>/g, '');
                    text = text.replace(/\s*/g, '');
                    return text
                } else {
                    return ''
                }
            },
            setEditorHtml(val) {
                this.editorHtml = val;
            },
            handleEditorHtml(val) {
                const text = this.getCleanText();
                this.$emit('update:text', text);
                this.$emit('input', val);
                this.$emit('change', val);
                if (this.validateEvent) {
                    this.dispatch('ElFormItem', 'el.form.change', [val]);
                }
            },
            dispatch(componentName, eventName, params) {
                let parent = this.$parent || this.$root;
                let name = parent.$options.componentName;

                while (parent && (!name || name !== componentName)) {
                    parent = parent.$parent;

                    if (parent) {
                        name = parent.$options.componentName;
                    }
                }
                if (parent) {
                    // eslint-disable-next-line prefer-spread
                    parent.$emit.apply(parent, [eventName].concat(params));
                }
            }
        }
    });

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
        if (typeof shadowMode !== 'boolean') {
            createInjectorSSR = createInjector;
            createInjector = shadowMode;
            shadowMode = false;
        }
        // Vue.extend constructor export interop.
        const options = typeof script === 'function' ? script.options : script;
        // render functions
        if (template && template.render) {
            options.render = template.render;
            options.staticRenderFns = template.staticRenderFns;
            options._compiled = true;
            // functional template
            if (isFunctionalTemplate) {
                options.functional = true;
            }
        }
        // scopedId
        if (scopeId) {
            options._scopeId = scopeId;
        }
        let hook;
        if (moduleIdentifier) {
            // server build
            hook = function (context) {
                // 2.3 injection
                context =
                    context || // cached call
                        (this.$vnode && this.$vnode.ssrContext) || // stateful
                        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
                // 2.2 with runInNewContext: true
                if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                    context = __VUE_SSR_CONTEXT__;
                }
                // inject component styles
                if (style) {
                    style.call(this, createInjectorSSR(context));
                }
                // register component module identifier for async chunk inference
                if (context && context._registeredComponents) {
                    context._registeredComponents.add(moduleIdentifier);
                }
            };
            // used by ssr in case component is cached and beforeCreate
            // never gets called
            options._ssrRegister = hook;
        }
        else if (style) {
            hook = shadowMode
                ? function (context) {
                    style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
                }
                : function (context) {
                    style.call(this, createInjector(context));
                };
        }
        if (hook) {
            if (options.functional) {
                // register for functional component in vue file
                const originalRender = options.render;
                options.render = function renderWithStyleInjection(h, context) {
                    hook.call(context);
                    return originalRender(h, context);
                };
            }
            else {
                // inject component registration as beforeCreate hook
                const existing = options.beforeCreate;
                options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
        }
        return script;
    }

    /* script */
    const __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("Editor", {
        ref: "editor",
        attrs: { init: _vm.editorInit },
        model: {
          value: _vm.editorHtml,
          callback: function($$v) {
            _vm.editorHtml = $$v;
          },
          expression: "editorHtml"
        }
      })
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = undefined;
      /* scoped */
      const __vue_scope_id__ = undefined;
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject */
      
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__ = normalizeComponent(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        false,
        undefined,
        undefined,
        undefined
      );

    var index = {};

    exports.TinymceEditor = __vue_component__;
    exports.default = index;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
