import axios from "axios"

export async function useGiphy(query) {
    let config = {
        headers: {},
        url: `https://api.giphy.com/v1/gifs/search?api_key=f2TYSE6XdOoHuRC780SHtqPEMNcE9C4Q&q=${query}&limit=50&offset=0&rating=g&lang=en`
    }

    try {
        const response = await axios(config)
        console.log('axios response', response)
        return response.data

    } catch (error) {
        console.log('error', error)
        // console.log("There was a problem.", error)
        if (error.response.status === 403) {
            console.log('bad token, logout')

            userStore.performLogout;
        }
        else if (error.response && error.response.data) {
            return error.response.data
        }
    }

    // return () => {
    //     ourRequest.cancel()
    // }


}

export default useGiphy
