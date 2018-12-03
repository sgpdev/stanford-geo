import React from "react";
import axios from "axios";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    postSearch() {
        axios
            .post("/api", {
                type: "samples",
                filters: {
                    country: ["USA", "Canada"],
                    color_name: ["blue", "brown", "red"],
                    fe: [0, 2]
                },
                show: ["country", "color_name", "fe"]
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    render() {
        return ( <
            div >
            <
            h1 className = "title" > MERN - Stack Template < /h1> <
            br / >
            <
            p > Happy coding! < /p> <
            button onClick = {
                this.postSearch
            } > Search < /button> < /
            div >
        );
    }
}

export default App;
