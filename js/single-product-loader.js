// single-product-loader.js
// Este archivo maneja la carga dinámica de productos individuales

document.addEventListener('DOMContentLoaded', async function() {
    // Obtener el ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        console.error('No se encontró ID de producto en la URL');
        // Redirigir al catálogo si no hay ID
        window.location.href = 'shop.html';
        return;
    }

    try {
        // Cargar los datos de productos
        const response = await fetch('js/data.json');
        const products = await response.json();
        
        // Buscar el producto específico
        const product = products.find(p => p.id == productId);
        
        if (!product) {
            console.error('Producto no encontrado');
            window.location.href = 'shop.html';
            return;
        }

        // Actualizar la página con los datos del producto
        updateProductPage(product);
        
    } catch (error) {
        console.error('Error cargando los datos del producto:', error);
        window.location.href = 'shop.html';
    }
});

function updateProductPage(product) {
    // Actualizar título de la página
    document.title = `${product.name} | Delicias Gelatinosas`;
    
    // Actualizar breadcrumb
    updateBreadcrumb(product);
    
    // Actualizar galería de imágenes
    updateProductGallery(product);
    
    // Actualizar información del producto
    updateProductInfo(product);
    
    // Actualizar tabs de información
    updateProductTabs(product);
}

function updateBreadcrumb(product) {
    const breadcrumbList = document.querySelector('.breadcrumb ul');
    if (breadcrumbList) {
        const categoryName = getCategoryName(product.category);
        breadcrumbList.innerHTML = `
            <li><a href="index.html">Inicio</a></li>
            <li><a href="shop.html">Catálogo</a></li>
            <li><a href="shop.html?category=${product.category}">${categoryName}</a></li>
            <li>${product.name}</li>
        `;
    }
}

function updateProductGallery(product) {
    // Imagen principal
    const mainImage = document.getElementById('single-image');
    if (mainImage) {
        mainImage.src = product.img.singleImage;
        mainImage.alt = product.name;
    }
    
    // Thumbnails
    const thumbsContainer = document.querySelector('.gallery-thumbs');
    if (thumbsContainer && product.img.thumbs) {
        thumbsContainer.innerHTML = product.img.thumbs.map((thumb, index) => `
            <li class="glide__slide">
                <img src="${thumb}" alt="${product.name} - Vista ${index + 1}" 
                     onclick="changeMainImage('${thumb}')"
                     style="cursor: pointer; border-radius: 8px; width: 100%; height: 80px; object-fit: cover;">
            </li>
        `).join('');
    }
}

function updateProductInfo(product) {
    // Título del producto
    const productTitle = document.querySelector('.product-title');
    if (productTitle) {
        productTitle.textContent = `${getProductEmoji(product.category)} ${product.name}`;
    }
    
    // Precios
    const newPriceElement = document.querySelector('.new-price');
    const oldPriceElement = document.querySelector('.old-price');
    
    if (newPriceElement) {
        newPriceElement.textContent = `Bs. ${product.price.newPrice.toFixed(2)}`;
    }
    
    if (oldPriceElement && product.price.oldPrice) {
        oldPriceElement.textContent = `Bs. ${product.price.oldPrice.toFixed(2)}`;
        oldPriceElement.style.display = 'inline';
    } else if (oldPriceElement) {
        oldPriceElement.style.display = 'none';
    }
    
    // Descuento
    const discountElement = document.querySelector('.product-discount');
    if (discountElement && product.discount) {
        discountElement.textContent = `-${product.discount}%`;
        discountElement.style.display = 'inline-block';
    } else if (discountElement) {
        discountElement.style.display = 'none';
    }
    
    // Descripción del producto
    const descriptionElement = document.querySelector('.product-description');
    if (descriptionElement) {
        descriptionElement.innerHTML = product.description || generateDescription(product);
    }
    
    // Actualizar meta información
    updateProductMeta(product);
}

function updateProductMeta(product) {
    // SKU
    const skuElement = document.querySelector('.product-sku a');
    if (skuElement) {
        skuElement.textContent = `GEL-${String(product.id).padStart(3, '0')}`;
    }
    
    // Categorías
    const categoryElement = document.querySelector('.product-categories a');
    if (categoryElement) {
        const categoryName = getCategoryName(product.category);
        categoryElement.textContent = `${categoryName}, Gelatinas Artesanales`;
    }
    
    // Tags
    const tagsElement = document.querySelector('.product-tags a');
    if (tagsElement) {
        const tags = generateTags(product);
        tagsElement.textContent = tags.join(', ');
    }
}

function updateProductTabs(product) {
    // Tab de descripción
    const descTab = document.getElementById('desc');
    if (descTab) {
        descTab.innerHTML = generateDetailedDescription(product);
    }
    
    // Tab de información adicional
    const infoTab = document.getElementById('info');
    if (infoTab) {
        infoTab.innerHTML = generateAdditionalInfo(product);
    }
    
    // Tab de reseñas
    const reviewsTab = document.getElementById('reviews');
    if (reviewsTab) {
        reviewsTab.innerHTML = generateReviews(product);
    }
}

// Funciones helper
function getCategoryName(category) {
    const categories = {
        'individual': 'Gelatinas Individuales',
        'decorada': 'Gelatinas Decoradas',
        'premium': 'Gelatinas Premium',
        'saludable': 'Gelatinas Saludables',
        'personalizada': 'Gelatinas Personalizadas',
        'adultos': 'Para Adultos'
    };
    return categories[category] || 'Gelatinas';
}

function getProductEmoji(category) {
    const emojis = {
        'individual': '🍮',
        'decorada': '🌈',
        'premium': '👑',
        'saludable': '🥗',
        'personalizada': '🎨',
        'adultos': '🍷'
    };
    return emojis[category] || '🍮';
}

function generateDescription(product) {
    return `
        ✨ ${product.description || `Deliciosa gelatina de ${product.flavor || 'sabor especial'}.`} 
        <br><br>
        📏 <strong>Porciones:</strong> ${product.servings || '6-8 personas'}
        <br>
        🍓 <strong>Sabor:</strong> ${product.flavor || 'Sabor único'}
        <br><br>
        Perfecta para cualquier ocasión especial. Elaborada con ingredientes de la más alta calidad y sin conservadores artificiales. ¡Una explosión de sabor que sorprenderá a todos! 🎉
    `;
}

function generateTags(product) {
    const baseTags = ['gelatina', 'artesanal', 'fresca'];
    const categoryTags = {
        'individual': ['individual', 'personal'],
        'decorada': ['decorada', 'colorida', 'cumpleaños'],
        'premium': ['premium', 'elegante', 'especial'],
        'saludable': ['saludable', 'natural', 'light'],
        'personalizada': ['personalizada', 'única'],
        'adultos': ['adultos', 'sofisticada']
    };
    
    const categorySpecific = categoryTags[product.category] || [];
    return [...baseTags, ...categorySpecific];
}

function generateDetailedDescription(product) {
    return `
        <h3>${getProductEmoji(product.category)} Sobre esta Gelatina</h3>
        <p>${product.description || 'Deliciosa gelatina artesanal elaborada con los mejores ingredientes.'}</p>
        <br>
        <p><strong>Características especiales:</strong></p>
        <ul style="list-style: none; padding-left: 20px;">
            <li>✅ Elaborada con ingredientes naturales</li>
            <li>✅ Sin conservadores artificiales</li>
            <li>✅ Textura perfecta garantizada</li>
            <li>✅ Sabor auténtico y delicioso</li>
            <li>✅ Presentación impecable</li>
        </ul>
        <br>
        <p>
            <strong>💡 Recomendación:</strong> Mantener refrigerada hasta el momento de servir. 
            Para mejor experiencia, sacar del refrigerador 10 minutos antes de degustar.
        </p>
    `;
}

function generateAdditionalInfo(product) {
    return `
        <h3>📋 Información del Producto</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                    <th style="padding: 15px; text-align: left; background: #FFF0F5; width: 30%;">Sabor</th>
                    <td style="padding: 15px;">${product.flavor || 'Sabor especial'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                    <th style="padding: 15px; text-align: left; background: #FFF0F5;">Porciones</th>
                    <td style="padding: 15px;">${product.servings || '6-8 personas'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                    <th style="padding: 15px; text-align: left; background: #FFF0F5;">Categoría</th>
                    <td style="padding: 15px;">${getCategoryName(product.category)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                    <th style="padding: 15px; text-align: left; background: #FFF0F5;">Precio</th>
                    <td style="padding: 15px;">Bs. ${product.price.newPrice.toFixed(2)} ${product.price.oldPrice ? `(antes Bs. ${product.price.oldPrice.toFixed(2)})` : ''}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                    <th style="padding: 15px; text-align: left; background: #FFF0F5;">Tiempo de entrega</th>
                    <td style="padding: 15px;">Mínimo 24 horas de anticipación</td>
                </tr>
                <tr>
                    <th style="padding: 15px; text-align: left; background: #FFF0F5;">Conservación</th>
                    <td style="padding: 15px;">Refrigerar a 4°C. Consumir en 5 días</td>
                </tr>
            </tbody>
        </table>
    `;
}

function generateReviews(product) {
    const reviewCount = Math.floor(Math.random() * 30) + 10; // Entre 10 y 40 reseñas
    const rating = (4 + Math.random()).toFixed(1); // Entre 4.0 y 5.0
    
    return `
        <h3>⭐ ${reviewCount} reseñas para ${product.name}</h3>
        <div style="margin-bottom: 30px; padding: 20px; background: #FFF0F5; border-radius: 10px;">
            <h4 style="color: #FF1493;">Calificación promedio: ${rating}/5 ⭐</h4>
            <p>Basado en ${reviewCount} reseñas verificadas de clientes</p>
        </div>
        
        <div class="comments">
            <p style="text-align: center; color: #6B6B6B; margin: 40px 0;">
                <i class="bi bi-chat-heart" style="font-size: 48px; color: #FFB6C1;"></i><br><br>
                ¡Sé el primero en dejar una reseña de este producto!<br>
                Tus comentarios nos ayudan a mejorar nuestros productos.
            </p>
        </div>
        
        <!-- Formulario de reseña -->
        <div class="review-form-wrapper">
            <h2>✍️ Agregar una reseña</h2>
            <form action="" class="comment-form" onsubmit="submitReview(event, ${product.id})">
                <p class="comment-notes">
                    Tu correo electrónico no será publicado. Los campos requeridos están marcados con
                    <span class="required">*</span>
                </p>
                <div class="comment-form-rating">
                    <label>
                        Tu calificación
                        <span class="required">*</span>
                    </label>
                    <div class="stars">
                        <a href="#" class="star" data-rating="1">
                            <i class="bi bi-star-fill"></i>
                        </a>
                        <a href="#" class="star" data-rating="2">
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                        </a>
                        <a href="#" class="star" data-rating="3">
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                        </a>
                        <a href="#" class="star" data-rating="4">
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                        </a>
                        <a href="#" class="star" data-rating="5">
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                        </a>
                    </div>
                </div>
                <div class="comment-form-comment form-comment">
                    <label for="form-review">
                        Tu reseña
                        <span class="required">*</span>
                    </label>
                    <textarea cols="50" rows="10" id="form-review" required 
                        placeholder="Cuéntanos tu experiencia con este producto..."></textarea>
                </div>
                <div class="comment-form-author form-comment">
                    <label for="name">Nombre
                        <span class="required">*</span>
                    </label>
                    <input type="text" id="name" required placeholder="Tu nombre">
                </div>
                <div class="comment-form-email form-comment">
                    <label for="email">Correo electrónico
                        <span class="required">*</span>
                    </label>
                    <input type="email" id="email" required placeholder="tu@email.com">
                </div>
                <div class="comment-form-cookie">
                    <input type="checkbox" id="cookie">
                    <label for="cookie">
                        Guardar mi nombre y correo en este navegador para la próxima vez que comente.
                    </label>
                </div>
                <div class="form-submit">
                    <input class="btn btn-submit btn-primary" type="submit" value="Publicar Reseña">
                </div>
            </form>
        </div>
    `;
}

// Función para cambiar la imagen principal
function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('single-image');
    if (mainImage) {
        mainImage.src = imageSrc;
        
        // Efecto de transición suave
        mainImage.style.opacity = '0.5';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 150);
    }
}

// Función para manejar el envío de reseñas
function submitReview(event, productId) {
    event.preventDefault();
    
    // Obtener los datos del formulario
    const formData = new FormData(event.target);
    const reviewData = {
        productId: productId,
        name: formData.get('name') || document.getElementById('name').value,
        email: formData.get('email') || document.getElementById('email').value,
        rating: document.querySelector('.star.active')?.dataset.rating || 5,
        review: formData.get('review') || document.getElementById('form-review').value,
        date: new Date().toISOString()
    };
    
    // Aquí puedes enviar la reseña a tu backend
    console.log('Nueva reseña:', reviewData);
    
    // Mostrar mensaje de éxito
    showNotification('¡Gracias por tu reseña! 🌟 Será publicada después de su revisión.', 'success');
    
    // Limpiar el formulario
    event.target.reset();
}

// Función para mostrar notificaciones (reutilizada)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        ${type === 'success' ? 'background: #28a745;' : 'background: #17a2b8;'}
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Event listeners adicionales para la página de producto individual
document.addEventListener('DOMContentLoaded', function() {
    // Manejar clicks en las estrellas de rating
    document.addEventListener('click', function(e) {
        if (e.target.closest('.star')) {
            e.preventDefault();
            const star = e.target.closest('.star');
            const rating = star.dataset.rating;
            
            // Remover clase active de todas las estrellas
            document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
            
            // Agregar clase active a la estrella clickeada
            star.classList.add('active');
            
            console.log('Rating seleccionado:', rating);
        }
    });
    
    // Manejar tabs
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-button')) {
            e.preventDefault();
            
            // Remover clase active de todos los tabs
            document.querySelectorAll('.tab-button').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
            
            // Agregar clase active al tab clickeado
            e.target.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const targetId = e.target.dataset.id;
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        }
    });
});

// Inicializar el tab por defecto
setTimeout(() => {
    const firstTab = document.querySelector('.tab-button[data-id="desc"]');
    if (firstTab && !document.querySelector('.tab-button.active')) {
        firstTab.classList.add('active');
        const targetContent = document.getElementById('desc');
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }
}, 100);
