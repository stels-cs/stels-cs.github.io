
## Nft metadata

```json
{
  "name": "Magic Mushroom #57",
  "description": "Hand drawing brings the NFT an artistic value, while various accessories and materials bring uniqueness and significance in our rapidly changing world.",
  "image": "https://s.getgems.io/nft/c/62695cb92d780b7496caea3a/nft/56/629b9349e034e8e582cf6448.png",
  "attributes": [
    {
      "trait_type": "Material",
      "value": "Wool fabric"
    },
    {
      "trait_type": "Hat",
      "value": "Top hat"
    },
    {
      "trait_type": "Glasses",
      "value": "None"
    },
    {
      "trait_type": "Item",
      "value": "None"
    },
    {
      "trait_type": "Background",
      "value": "Dark"
    }
  ]
}
```

||||
|-|-|-|
name|название нфт|рекомндуемая длина не более 15-30 символов|
description|описание нфт|рекомндуемая длина до 500 символов|
image|ссылка на изображение|поддерживаются https и ipfs ссылки, рекомендуется использовать квадратное изображение разметом 1000x1000 пикселей, поддерживаются форматы png, jpg, gif, webp, svg, размер файла не более 30 мб. Если вы используете видео то рекомендуется изображением сделать первый кадр этого видео|
content_type|тип контента по ссылке из content_url|Например video/mp4|
content_url|ссылка на дополнительный контент|На текущий момент поддерживаются только видео, mp4 webm quicktime или mpeg, максимальный размер файла 100мб, рекомендуемый зармер видео 1000x1000 пикселей|
lottie|ссылка на json файл с лотти анимацией|Если указано то на странице с нфт будет проигрываться lottie анимания из этого файла. [Прмер нфт использующих lottie](https://getgems.io/collection/EQAG2BH0JlmFkbMrLEnyn2bIITaOSssd4WdisE4BdFMkZbir/EQCoADmGFboLrgOCDSwAe-jI-lOOVoRYllA5F4WeIMokINW8)|
attributes|атрибуты нфт|Массив атрибутов где для каждлго атрибута указаны trait_type (название атрибуда) value (значение атрибута)
