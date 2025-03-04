const { AIRTABLE_API_KEY, AIRTABLE_DB_ID } = import.meta.env;

export async function getProductInfo(id) {
    let loading = true;
    let data = null;
    let error = null;

    try {
        const response = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_DB_ID}/Productos/${id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            error = `Error al cargar producto: ${response.statusText}`;
        } else {
            const { fields } = await response.json();
            data = fields;
        }
    } catch (err) {
        error = `Error al cargar producto: ${err.message}`;
    } finally {
        loading = false;
    }

    return { loading, data, error };
}
