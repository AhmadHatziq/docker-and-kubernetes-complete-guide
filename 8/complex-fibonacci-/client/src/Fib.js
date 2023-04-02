import React, { Component } from 'react'; 
import axios from 'axios'; // Axios is used to connect to the backend, I think. 

class Fib extends Component {
    state = {
        seenIndexes: [], 
        values: {},  
        index: ''
    }; 

    componentDidMount() {
        this.fetchValues(); 
        this.fetchIndexes(); 
    }; 

    async fetchValues() {
        const values = await axios.get('/api/values/current'); 
        this.setState({ values: values.data}); 
    }; 

    async fetchIndexes() {
        const seenIndexes = await axios.get('/api/values/all'); 
        this.setState({
            seenIndexes: seenIndexes.data
        }); 
    }; 

    // Render the indexes ie an array of objsects from Postgres 
    renderSeenIndexes() {
        // seenIndexes is an array of numbers  
        // We only want numbers so map out (to extract the number itself)
        // and join with a comma 

        let output_string = ""; 
        for (let index in this.state.seenIndexes) {
            output_string += index.number; 
        }

        // return getOwnPropertyNames(this.state.seenIndexes[0]); 
        return this.state.seenIndexes.map(({ number }) => number).join(', ');

        // return String(this.state.seenIndexes); 
        // return this.state.seenIndexes.map(({ number }) => number.join(', ') ); 
    }

    // Render the calculated values, which is stored from Redis. 
    // Here, is an object. There is a different iteration logic compared to renderSeenIndexes
    renderValues() {
        const entries = []; 

        // console.log(this.state.values); 

        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.values[key]}
                </div>
            )
        }

        return entries; 
    }

    // handleSubmit needs to be a bound function
    handleSubmit = async (event) => {

        // Prevent the form from submitting itself 
        event.preventDefault(); 

        // To a post requires to the API endpoint 
        await axios.post('/api/values', {
            index: this.state.index
        }); 
        
        // Reset the value back to empty 
        this.setState({index: ''}); 

    }; 

    // Render the whole page 
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index: </label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({ index: event.target.value})}
                    /> 
                    <button>Submit</button>   
                </form> 

                <h3>Indexes I have seen: </h3>

                {this.renderSeenIndexes()}

                <h3>Calculated Values: </h3>

                {this.renderValues()}

            </div>
            )
    }; 

}

export default Fib; 