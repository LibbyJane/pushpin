import axios from "axios"
let controller = null;

export async function useGiphy(query, pageSize, offset) {
    try {
        if (controller) {
            controller.abort()
        }
        controller = new AbortController();
        const URL = `https://api.giphy.com/v1/gifs/search?api_key=f2TYSE6XdOoHuRC780SHtqPEMNcE9C4Q&q=${query}&limit=${pageSize ? pageSize : 50}&offset=${offset ? offset : 0}&rating=g&lang=en`;
        let config = {
            headers: {},
            url: URL,
            signal: controller.signal
        }
        const response = await axios(config)
        // console.log('axios response', response)


        return response.data

    } catch (error) {
        console.log('error', error)
        // console.log("There was a problem.", error)

    } finally {
        controller = null;
    }
}

export default useGiphy
