#!/bin/bash

# Verificar se ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick não encontrado. Instalando..."
    pkg install imagemagick -y
fi

# Remover XMLs conflitantes que podem ter prioridade sobre os PNGs
echo "🧹 Removendo XMLs conflitantes..."
rm -f android/app/src/main/res/drawable/ic_launcher_background.xml
rm -f android/app/src/main/res/drawable-v24/ic_launcher_foreground.xml

# Criar diretórios
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi
mkdir -p android/app/src/main/res/drawable

# Gerar ícones em diferentes resoluções
echo "📱 Gerando ícones..."

# MDPI - 48x48
convert assets/icon/icon.svg -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert assets/icon/icon.svg -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
convert assets/icon/icon.svg -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png

# HDPI - 72x72
convert assets/icon/icon.svg -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert assets/icon/icon.svg -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
convert assets/icon/icon.svg -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png

# XHDPI - 96x96
convert assets/icon/icon.svg -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert assets/icon/icon.svg -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
convert assets/icon/icon.svg -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png

# XXHDPI - 144x144
convert assets/icon/icon.svg -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert assets/icon/icon.svg -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
convert assets/icon/icon.svg -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png

# XXXHDPI - 192x192
convert assets/icon/icon.svg -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
convert assets/icon/icon.svg -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png
convert assets/icon/icon.svg -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png

# Ícone da Play Store - 512x512
convert assets/icon/icon.svg -resize 512x512 assets/icon/playstore.png

# Criar background drawable preto para adaptive icon
echo "🎨 Criando background drawable..."
cat > android/app/src/main/res/drawable/ic_launcher_background.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#000000"/>
</shape>
EOF

echo "✅ Ícones gerados com sucesso!"
