#!/bin/bash
echo "=== ИСПРАВЛЕНИЕ ПУТЕЙ В HTML ФАЙЛАХ ==="

# Находим все HTML файлы и исправляем их
find . -name "*.html" -type f | while read file; do
    echo "Исправление: $file"
    
    # Создаем временный файл
    tmp_file="${file}.tmp"
    
    # Исправляем пути
    sed \
        -e 's|xlink:href="/images/|xlink:href="images/|g' \
        -e 's|src="/video/|src="video/|g' \
        -e 's|href="/images/|href="images/|g' \
        -e 's|poster="/images/|poster="images/|g' \
        -e 's|src="/js/|src="js/|g' \
        -e 's|src="/css/|src="css/|g' \
        "$file" > "$tmp_file"
    
    # Заменяем оригинальный файл
    mv "$tmp_file" "$file"
    
    echo "✅ $file исправлен"
done

echo ""
echo "=== ПРОВЕРКА ИСПРАВЛЕННЫХ ПУТЕЙ ==="
grep -r 'xlink:href=".*/images/' . --include="*.html" || echo "✅ Все пути исправлены"
