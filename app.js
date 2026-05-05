/**
 * ImagineFood - Recipe Discovery Interface
 * Powered by FreeAPI
 */

const CONFIG = {
    API_URL: 'https://api.freeapi.app/api/v1/public/meals',
    ITEMS_PER_PAGE: 12,
    SKELETON_COUNT: 12,
};

const elements = {
    mealsGrid: document.getElementById('meals-grid'),
    errorState: document.getElementById('error-state'),
    retryButton: document.getElementById('retry-button'),
    searchInput: document.getElementById('search-input'),
    modal: document.getElementById('meal-modal'),
    modalContent: document.getElementById('modal-content'),
    closeModal: document.getElementById('close-modal'),
    modalOverlay: document.getElementById('modal-overlay'),
    loadMoreButton: document.getElementById('load-more-button'),
    loadMoreLoading: document.getElementById('load-more-loading'),
};

let allMeals = []; // All meals fetched and shuffled
let displayedMealsCount = 0;
let isSearching = false;

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

/**
 * Extracts ingredients and measures from a meal object
 */
const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
        }
    }
    return ingredients;
};

/**
 * Shows meal details in a modal
 */
window.showMealDetails = (id) => {
    const meal = allMeals.find(m => String(m.id) === String(id) || String(m.idMeal) === String(id));
    if (!meal) return;

    const ingredients = getIngredients(meal);
    const { strMeal, strMealThumb, strCategory, strArea, strInstructions, strYoutube, strTags } = meal;

    elements.modalContent.innerHTML = `
        <div class="relative">
            <div class="h-64 sm:h-96 w-full relative">
                <img src="${strMealThumb}" alt="${strMeal}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-6 sm:p-8">
                    <div class="flex flex-wrap gap-2 mb-3">
                        <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white uppercase tracking-wider">
                            ${strCategory}
                        </span>
                        <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 uppercase tracking-wider">
                            ${strArea}
                        </span>
                    </div>
                    <h2 class="text-3xl sm:text-4xl font-bold text-white brand-font">${strMeal}</h2>
                </div>
            </div>
            
            <div class="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-8">
                    <section>
                        <h3 class="text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                            </svg>
                            Instructions
                        </h3>
                        <div class="text-slate-600 leading-relaxed whitespace-pre-line">
                            ${strInstructions}
                        </div>
                    </section>

                    ${strYoutube ? `
                    <section>
                        <h3 class="text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <svg class="w-6 h-6 mr-2 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            Video Tutorial
                        </h3>
                        <a href="${strYoutube}" target="_blank" class="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-xl font-semibold hover:bg-red-100 transition-colors">
                            Watch on YouTube →
                        </a>
                    </section>
                    ` : ''}
                </div>

                <div class="space-y-8">
                    <section class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                            Ingredients
                        </h3>
                        <ul class="space-y-3">
                            ${ingredients.map(ing => `
                                <li class="flex items-start text-sm text-slate-600">
                                    <span class="w-2 h-2 mt-1.5 mr-3 bg-indigo-400 rounded-full flex-shrink-0"></span>
                                    ${ing}
                                </li>
                            `).join('')}
                        </ul>
                    </section>

                    ${strTags ? `
                    <section>
                        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Tags</h3>
                        <div class="flex flex-wrap gap-2">
                            ${strTags.split(',').map(tag => `
                                <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">#${tag.trim()}</span>
                            `).join('')}
                        </div>
                    </section>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    elements.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
};

/**
 * Closes the meal modal
 */
const closeModal = () => {
    elements.modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
};

/**
 * Creates a skeleton loader card
 */
const createSkeletonCard = () => `
    <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
        <div class="aspect-video bg-slate-200"></div>
        <div class="p-5 space-y-3">
            <div class="flex space-x-2">
                <div class="h-5 bg-slate-200 rounded-full w-16"></div>
                <div class="h-5 bg-slate-200 rounded-full w-16"></div>
            </div>
            <div class="h-6 bg-slate-200 rounded w-3/4"></div>
            <div class="h-4 bg-slate-200 rounded w-full"></div>
        </div>
    </div>
`;

/**
 * Creates a recipe card component
 */
const createRecipeCard = (meal) => {
    const { id, idMeal, strMeal, strMealThumb, strCategory, strArea, strInstructions } = meal;
    const mealId = id || idMeal;
    
    // Fallback values
    const category = strCategory || 'General';
    const area = strArea || 'Global';
    const thumbnail = strMealThumb || 'https://via.placeholder.com/600x400?text=No+Image';
    
    // Use instructions for a unique description
    const description = strInstructions 
        ? strInstructions.split('.')[0] + '.' 
        : `Enjoy this delicious ${area.toLowerCase()} ${category.toLowerCase()} dish.`;

    return `
        <article 
            onclick="showMealDetails('${mealId}')"
            class="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 transform hover:-translate-y-1"
        >
            <div class="relative aspect-video overflow-hidden">
                <img 
                    src="${thumbnail}" 
                    alt="${strMeal}" 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span class="text-white text-sm font-medium">View Recipe →</span>
                </div>
            </div>
            <div class="p-5">
                <div class="flex flex-wrap gap-2 mb-3">
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                        ${category}
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        ${area}
                    </span>
                </div>
                <h3 class="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    ${strMeal}
                </h3>
                <p class="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                    ${description}
                </p>
            </div>
        </article>
    `;
};

/**
 * Renders the meals to the grid
 */
const renderMeals = (meals, append = false) => {
    if (!append && meals.length === 0) {
        elements.mealsGrid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div class="bg-slate-100 p-4 rounded-full mb-4">
                    <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-bold text-slate-800">No recipes found</h3>
                <p class="text-slate-500">Try adjusting your search criteria.</p>
            </div>
        `;
        return;
    }
    
    const html = meals.map(meal => createRecipeCard(meal)).join('');
    if (append) {
        elements.mealsGrid.insertAdjacentHTML('beforeend', html);
    } else {
        elements.mealsGrid.innerHTML = html;
    }
};

/**
 * Renders the loading state
 */
const renderLoading = (append = false) => {
    elements.errorState.classList.add('hidden');
    elements.mealsGrid.classList.remove('hidden');
    
    if (append) {
        elements.loadMoreButton.classList.add('hidden');
        elements.loadMoreLoading.classList.remove('hidden');
    } else {
        elements.mealsGrid.innerHTML = Array(CONFIG.SKELETON_COUNT).fill(createSkeletonCard()).join('');
    }
};

/**
 * Renders the error state
 */
const renderError = () => {
    elements.mealsGrid.classList.add('hidden');
    elements.errorState.classList.remove('hidden');
    elements.loadMoreButton.classList.add('hidden');
    elements.loadMoreLoading.classList.add('hidden');
};

/**
 * Handles search input filtering
 */
const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        isSearching = false;
        displayedMealsCount = 0;
        elements.mealsGrid.innerHTML = '';
        loadMoreMeals();
        return;
    }

    isSearching = true;
    elements.loadMoreButton.classList.add('hidden');
    
    const filteredMeals = allMeals.filter(meal => {
        return (
            meal.strMeal.toLowerCase().includes(searchTerm) ||
            meal.strCategory.toLowerCase().includes(searchTerm) ||
            meal.strArea.toLowerCase().includes(searchTerm) ||
            (meal.strInstructions && meal.strInstructions.toLowerCase().includes(searchTerm))
        );
    });
    renderMeals(filteredMeals);
};

/**
 * Loads more meals from the shuffled allMeals array
 */
const loadMoreMeals = () => {
    if (isSearching) return;

    const nextBatch = allMeals.slice(displayedMealsCount, displayedMealsCount + CONFIG.ITEMS_PER_PAGE);
    if (nextBatch.length > 0) {
        renderMeals(nextBatch, displayedMealsCount > 0);
        displayedMealsCount += nextBatch.length;
    }

    // Handle Load More button visibility
    elements.loadMoreLoading.classList.add('hidden');
    if (displayedMealsCount < allMeals.length) {
        elements.loadMoreButton.classList.remove('hidden');
    } else {
        elements.loadMoreButton.classList.add('hidden');
    }
};

/**
 * Main function to fetch all meals once and then randomize
 */
const fetchAllAndInitialize = async () => {
    try {
        renderLoading(false);
        elements.loadMoreButton.classList.add('hidden');

        // Fetch all items (limit 300 to get everything in one go for true randomization)
        const response = await fetch(`${CONFIG.API_URL}?limit=300`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        
        if (!json.success || !json.data || !json.data.data) {
            throw new Error('Invalid API response structure');
        }

        // Shuffle all meals immediately
        allMeals = shuffleArray(json.data.data);

        // Simulate a slight delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        elements.mealsGrid.innerHTML = '';
        loadMoreMeals();
        
    } catch (error) {
        console.error('Fetch error:', error);
        renderError();
    }
};

/**
 * Handles "Load More" click
 */
const handleLoadMore = () => {
    elements.loadMoreButton.classList.add('hidden');
    elements.loadMoreLoading.classList.remove('hidden');
    
    // Slight delay for loading feel
    setTimeout(() => {
        loadMoreMeals();
    }, 400);
};

// Event Listeners
elements.retryButton.addEventListener('click', () => fetchAllAndInitialize());
elements.searchInput.addEventListener('input', handleSearch);
elements.closeModal.addEventListener('click', closeModal);
elements.modalOverlay.addEventListener('click', closeModal);
elements.loadMoreButton.addEventListener('click', handleLoadMore);

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !elements.modal.classList.contains('hidden')) {
        closeModal();
    }
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => fetchAllAndInitialize());
