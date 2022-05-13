import { Routes, Route } from 'react-router-dom'
import Offers from './Offers'

export default function Sandbox() {
    // destructuring
    //-------------------
    // objects
    const person = {
        firstName: 'Jo',
        age: 30,
        favColor: 'green'
    }

    const { firstName, favColor } = person

    // arrays
    const nums = [9,1,3,5,2]
    const [a,b,c] = nums

    // functions
    const getCalculations = (a,b) => {
        return {
            sum: a + b,
            diff: Math.abs(a - b),
            product: a * b
        }
    }

    const {sum, product} = getCalculations(7,10)

    // filter
    //-------------------
    const dogs = [
        {name: "Penny", breed: "Labradoodle"},
        {name: "Lola", breed: "Labradoodle"},
        {name: "Murphy", breed: "Golden Retriever"},
        {name: "Maggie", breed: "Cockerpoo"},
        {name: "Teddy", breed: "Caverpoo"},
    ]

    const labradoodles = dogs.filter((dog)=>{
        return dog.breed === "Labradoodle"
    })

    // map
    const names = dogs.map((dog)=>{
        return dog.name
    })

    console.log('labradoodles', labradoodles)
    console.log('names', names)

    const dogsAndCats = [...dogs, {name: "Socks", breed: "Domestic ShortHair"}]
    console.log('dogsAndCats', dogsAndCats)

    return (
        <div class="card">
            <h1>destructuring</h1>
            <p>{firstName}, {favColor}</p>
            <p>{a}, {b}, {c}</p>
            <p>{sum}, {product}</p>

            <Routes>
                <Route path="offers" element={<Offers />} />
            </Routes>
        </div>
    )
}