import './App.css';
import React from 'react';
import {getRandomName, getRandomColor, getRandomAge} from "./utils";


const GENERATE_INTERVAL = 5000;
const GET_HUNGER_TIME = 30000;
const HUNGRY_MAX_TIME = 5000;

class App extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            myCats : [],
            neighboursCats: []
        };
    }

    generateCat() {
        const hasCollar = Math.random() >= 0.5;

        const newCat = {
            name : getRandomName(),
            age: getRandomAge(),
            color: getRandomColor(),
            hasCollar,
            isHungry: false,
            hungryTime: new Date().getTime() + GET_HUNGER_TIME,
        }

        if (hasCollar) {
            const cats = this.state.myCats;
            cats.push(newCat)
            this.setState({...this.state, myCats: cats});
        }
        else {
            const cats = this.state.neighboursCats;
            cats.push(newCat)
            this.setState({...this.state, neighboursCats: cats});
        }
    }

    updateHungryTimes() {
        const currentTime = new Date().getTime();
        const myCats = this.state.myCats.map(cat => {
            if (currentTime >= (cat.hungryTime)){
                cat.isHungry = true;
            }
            return cat;
        }).filter(cat => {
            const latestTimeToFeed = cat.hungryTime + HUNGRY_MAX_TIME;
            return currentTime < latestTimeToFeed
        });

        const neighboursCats = this.state.neighboursCats.map(cat => {
            if (currentTime >= (cat.hungryTime)){
                cat.isHungry = true;
            }
            return cat;
        }).filter(cat => {
            const latestTimeToFeed = cat.hungryTime + HUNGRY_MAX_TIME;
            return currentTime < latestTimeToFeed
        });

        this.setState({
            ...this.state,
            myCats: myCats,
            neighboursCats: neighboursCats,
        });

    }

    componentDidMount() {
        const component = this;

        setInterval(function (){
            component.generateCat();
        }, GENERATE_INTERVAL);

        setInterval(function () {
            component.updateHungryTimes();
        }, 1000)
    }

    renderCats(cats){
        return cats.map(i => {
            return (
                <div className='layout'>
                    <div className='margin'>
                        <h3 className='cat-name'>{i.name} : {i.age} years</h3>
                        <div className="cat-box" style={{background: i.color}}>
                        </div>
                    </div>

                    <div>
                        {i.isHungry ? <button className='feed-btn' onClick={() => {
                            const currentTime = new Date().getTime();
                            i.isHungry = false;
                            i.hungryTime = currentTime + GET_HUNGER_TIME;
                            this.setState(this.state);
                        }}
                        >Feed</button> : null}
                    </div>
                </div>

            );
        })
    }

    render() {
        return (
            <div>
                <div className='main'>
                    <tr className='text'>
                        <th>My Cats</th>
                    </tr>

                    <tr className='text'>
                        <th>Neighborhood Cats</th>
                    </tr>

                </div>
            <div className='main'>
                <table>
                    <tr>
                        <td>
                            {this.renderCats(this.state.myCats)}
                        </td>
                    </tr>
                </table>

                <table>
                    <tr>
                        <td>
                            {this.renderCats(this.state.neighboursCats)}
                        </td>
                    </tr>
                </table>
            </div>

            </div>
        );
    }
}

export default App;
