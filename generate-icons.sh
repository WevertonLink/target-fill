#!/bin/bash

# Verificar se ImageMagick está instalado
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick não encontrado. Instalando..."
    pkg install imagemagick -y
fi

# Usar 'magick' se disponível, senão usar 'convert'
MAGICK_CMD="magick"
if ! command -v magick &> /dev/null; then
    MAGICK_CMD="convert"
fi

# Remover XMLs conflitantes (mas MANTER adaptive icons!)
echo "🧹 Removendo XMLs conflitantes..."
rm -f android/app/src/main/res/drawable-v24/ic_launcher_foreground.xml
rm -f android/app/src/main/res/values/ic_launcher_background.xml

# Criar background gradiente para adaptive icons
echo "🎨 Criando background gradiente para ícone launcher..."
mkdir -p android/app/src/main/res/drawable
cat > android/app/src/main/res/drawable/ic_launcher_background.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Background preto sólido -->
    <item>
        <shape android:shape="rectangle">
            <solid android:color="#000000"/>
        </shape>
    </item>

    <!-- Gradiente radial dourado sutil para profundidade -->
    <item>
        <shape android:shape="rectangle">
            <gradient
                android:type="radial"
                android:gradientRadius="60%p"
                android:centerColor="#1A1A1A"
                android:endColor="#000000"/>
        </shape>
    </item>

    <!-- Glow dourado sutil no centro -->
    <item>
        <shape android:shape="rectangle">
            <gradient
                android:type="radial"
                android:gradientRadius="50%p"
                android:centerColor="#1AFFD700"
                android:endColor="#00000000"/>
        </shape>
    </item>
</layer-list>
EOF

# Criar diretórios
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi

# Gerar ícones em diferentes resoluções COM transparência (RGBA) e PADDING (safe zone)
echo "📱 Gerando ícones Android com transparência para adaptive icons..."

# Fonte: usar PNG 512x512 que tem transparência correta
SOURCE_ICON="assets/icon/icon-512.png"

# MDPI - 48x48 (foreground com padding de 20% para safe zone)
echo "  → Gerando MDPI (48x48)..."
$MAGICK_CMD "$SOURCE_ICON" -resize 38x38 -gravity center -background none -extent 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png
$MAGICK_CMD "$SOURCE_ICON" -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
$MAGICK_CMD "$SOURCE_ICON" -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png

# HDPI - 72x72 (foreground com padding de 20% para safe zone)
echo "  → Gerando HDPI (72x72)..."
$MAGICK_CMD "$SOURCE_ICON" -resize 58x58 -gravity center -background none -extent 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png
$MAGICK_CMD "$SOURCE_ICON" -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
$MAGICK_CMD "$SOURCE_ICON" -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png

# XHDPI - 96x96 (foreground com padding de 20% para safe zone)
echo "  → Gerando XHDPI (96x96)..."
$MAGICK_CMD "$SOURCE_ICON" -resize 77x77 -gravity center -background none -extent 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png
$MAGICK_CMD "$SOURCE_ICON" -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
$MAGICK_CMD "$SOURCE_ICON" -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png

# XXHDPI - 144x144 (foreground com padding de 20% para safe zone)
echo "  → Gerando XXHDPI (144x144)..."
$MAGICK_CMD "$SOURCE_ICON" -resize 115x115 -gravity center -background none -extent 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png
$MAGICK_CMD "$SOURCE_ICON" -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
$MAGICK_CMD "$SOURCE_ICON" -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png

# XXXHDPI - 192x192 (foreground com padding de 20% para safe zone)
echo "  → Gerando XXXHDPI (192x192)..."
$MAGICK_CMD "$SOURCE_ICON" -resize 154x154 -gravity center -background none -extent 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png
$MAGICK_CMD "$SOURCE_ICON" -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
$MAGICK_CMD "$SOURCE_ICON" -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png

echo ""
echo "✅ Ícones Android gerados com sucesso!"
echo "✓ ic_launcher_foreground.png: RGBA com transparência + padding 20% (safe zone)"
echo "✓ ic_launcher.png: Ícone completo"
echo "✓ ic_launcher_round.png: Ícone redondo"
