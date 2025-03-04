const { AIRTABLE_API_KEY, AIRTABLE_DB_ID } = import.meta.env;

const CACHE_KEY = "products";
const CACHE_EXPIRATION_KEY = "products_expiration";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function getProducts() {
    if (typeof window !== "undefined" && window.localStorage) {
        const cachedProducts = localStorage.getItem(CACHE_KEY);
        const cacheExpiration = localStorage.getItem(CACHE_EXPIRATION_KEY);
        const now = new Date().getTime();

        if (
            cachedProducts &&
            cacheExpiration &&
            now < parseInt(cacheExpiration, 10)
        ) {
            return { products: JSON.parse(cachedProducts), error: null };
        }
    }

    const response = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_DB_ID}/Productos`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                "Content-Type": "application/json",
            },
        }
    );

    let products = [];
    let error = null;

    if (response.ok) {
        const { records } = await response.json();
        products = records;
        if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem(CACHE_KEY, JSON.stringify(products));
            localStorage.setItem(
                CACHE_EXPIRATION_KEY,
                (new Date().getTime() + CACHE_DURATION).toString()
            );
        }
    } else {
        error = `Error al cargar productos: ${response.statusText}`;
    }

    return { products, error };
}


export const getProductsIds = async () => {
    const { products, error } = await getProducts();

    if (error) {
        return { ids: [], error };
    }

    return { ids: products.map((product) => product.id), error };
};
