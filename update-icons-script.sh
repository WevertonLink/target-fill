#!/bin/bash

echo "🎨 Atualizando ícones do Target Fill..."

CUSTOM_DIR="$HOME/target-fill-icons-custom"
ANDROID_RES="android/app/src/main/res"

# Verificar se existe ícone de alta resolução
if [ -f "$CUSTOM_DIR/icon-512.png" ]; then
    echo "📦 Gerando todas as resoluções a partir do ícone 512x512..."
    
    # MDPI - 48x48
    magick "$CUSTOM_DIR/icon-512.png" -resize 48x48 "$ANDROID_RES/mipmap-mdpi/ic_launcher.png"
    magick "$CUSTOM_DIR/icon-512.png" -resize 48x48 "$ANDROID_RES/mipmap-mdpi/ic_launcher_round.png"
    
    # HDPI - 72x72
    magick "$CUSTOM_DIR/icon-512.png" -resize 72x72 "$ANDROID_RES/mipmap-hdpi/ic_launcher.png"
    magick "$CUSTOM_DIR/icon-512.png" -resize 72x72 "$ANDROID_RES/mipmap-hdpi/ic_launcher_round.png"
    
    # XHDPI - 96x96
    magick "$CUSTOM_DIR/icon-512.png" -resize 96x96 "$ANDROID_RES/mipmap-xhdpi/ic_launcher.png"
    magick "$CUSTOM_DIR/icon-512.png" -resize 96x96 "$ANDROID_RES/mipmap-xhdpi/ic_launcher_round.png"
    
    # XXHDPI - 144x144
    magick "$CUSTOM_DIR/icon-512.png" -resize 144x144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher.png"
    magick "$CUSTOM_DIR/icon-512.png" -resize 144x144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_round.png"
    
    # XXXHDPI - 192x192
    magick "$CUSTOM_DIR/icon-512.png" -resize 192x192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher.png"
    magick "$CUSTOM_DIR/icon-512.png" -resize 192x192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_round.png"
    
    echo "✅ Ícones gerados com sucesso!"
    
# Ou copiar diretamente se já estiverem nas resoluções corretas
elif [ -d "$CUSTOM_DIR/mdpi" ]; then
    echo "📋 Copiando ícones prontos..."
    
    cp "$CUSTOM_DIR/mdpi/ic_launcher.png" "$ANDROID_RES/mipmap-mdpi/"
    cp "$CUSTOM_DIR/hdpi/ic_launcher.png" "$ANDROID_RES/mipmap-hdpi/"
    cp "$CUSTOM_DIR/xhdpi/ic_launcher.png" "$ANDROID_RES/mipmap-xhdpi/"
    cp "$CUSTOM_DIR/xxhdpi/ic_launcher.png" "$ANDROID_RES/mipmap-xxhdpi/"
    cp "$CUSTOM_DIR/xxxhdpi/ic_launcher.png" "$ANDROID_RES/mipmap-xxxhdpi/"
    
    # Round icons (mesmos arquivos)
    cp "$CUSTOM_DIR/mdpi/ic_launcher.png" "$ANDROID_RES/mipmap-mdpi/ic_launcher_round.png"
    cp "$CUSTOM_DIR/hdpi/ic_launcher.png" "$ANDROID_RES/mipmap-hdpi/ic_launcher_round.png"
    cp "$CUSTOM_DIR/xhdpi/ic_launcher.png" "$ANDROID_RES/mipmap-xhdpi/ic_launcher_round.png"
    cp "$CUSTOM_DIR/xxhdpi/ic_launcher.png" "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_round.png"
    cp "$CUSTOM_DIR/xxxhdpi/ic_launcher.png" "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_round.png"
    
    echo "✅ Ícones copiados com sucesso!"
else
    echo "❌ Ícones não encontrados em $CUSTOM_DIR"
    echo "   Coloque icon-512.png ou a estrutura de pastas mdpi/hdpi/etc"
    exit 1
fi

echo ""
echo "🎯 Ícones atualizados! Próximos passos:"
echo "   pnpm exec cap sync android"
echo "   git add android/"
echo "   git commit -m '🎨 Update app icons'"
echo "   git push"
