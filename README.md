# visualize-typescript

Ever wished to add thumbnails to a typescript component or type OR see the color of a theme variable? I know I did so many times so I built this extension for both of us!

just add this magical comment at the type definition and you will see it when you hover over it from any file!

for colors: `// color(#ffff00)`
for images: `// image(/full/image/path.png)` or `// image(../relative/path/path.jpg)`

![image](https://raw.githubusercontent.com/a7madgamal/vscode-visualize-typescript/main/images/colorPreview.png)

![image](https://raw.githubusercontent.com/a7madgamal/vscode-visualize-typescript/main/images/imagePreview.png)

```typescript
type ColorsType = {
  inlineColor: string; // color(#ff0000)

  // color(#ff0000)
  previousLineColor: string;

  inlineImage: string; // image("/abs/path/mindblown.jpg");

  // image("./rel/path/mindblown.jpg")
  previousLineRelImage: string;
};

const alsoWorksDirectly = {
  inlineColor: "red", // color(#ff0000)
};
```

## Extension Settings

This extension contributes the following settings:

- `visualize-typescript.enabled`: enable/disable this extension

## Known Issues

this is an alpha stage project so please report any issues

- only hex colors for now

## Release Notes

check the ./CHANGELOG.md file for details
