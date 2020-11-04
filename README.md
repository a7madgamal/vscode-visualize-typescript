# visualize-typescript

Ever wished to add thumbnails to a typescript component or type OR see the color of a theme variable? I know I did so many times so I built this extension for both of us!

just add this magical comment at the type definition and you will see it when you hover over it from any file!

- color support coming soon...

```
export type ColorsType = {
  red: string /* $color(#ff0000) */;
  image: string // $img("/Users/hassanein/Downloads/mindblown.jpeg");
};
```
![image](https://raw.githubusercontent.com/a7madgamal/vscode-visualize-typescript/main/demo.png)

## Extension Settings

This extension contributes the following settings:

- `visualize-typescript.enabled`: enable/disable this extension

## Known Issues

this is an alpha stage project so please report any issues

## Release Notes

check the ./CHANGELOG.md file for details
