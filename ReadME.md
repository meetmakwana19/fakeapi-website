## DOM (Document object model)

1. Whole HTML document is treated as a Javascript object in this model
2. This will print the whole HTML document source code on the console.
```
console.log(document)
console.log(document.body)
```
3. Window is a global object. SO everything under JS comes under Window object
```
window.console.log(window)
```
4. The type can be seen as object too.
```
typeof document
> 'object'
```

## BOM (Browser Object model)

1. Additional objects provided by the browser(host environment) for working with everything ecept the document.
2. Functions like alert/comfirm/prompt/location are also part of the BOM
```
alert("hello")

location.href = "https://meetmakwana.netlify.app"
```

##### Lessons learnt 

1. Append modal container to the body tag directly so that it doesnt interfere with other elements. Appending modal to any element which has fixed/relative position will cause back-drop of whole page https://stackoverflow.com/a/11788713/17796286