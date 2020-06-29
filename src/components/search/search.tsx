import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import { connect } from "react-redux";
import { withTranslation, Trans } from 'react-i18next';
import { addWord } from '../../redux/actions/actions';
import { addRestaurantCode } from '../../redux/actions/actions';
import './search.scss';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


const pageVariant = {

    initial: {
        opacity: 0,
        x: "-100vw",
        scale: 0.8
    },
    in: {
        opacity: 1,
        x: 0,
        scale: 1
    },
    out: {
        opacity: 0,
        x: "100vw",
        scale: 1.1
    }
}

const searchesVariant = {
    in: {
        opacity: 1,
    },
    out: {
        opacity: 0,
    }
}

const pageTrans = {
    // transition: 'linear',
    ease: 'anticipate',
    duration: 1,
    type: 'tween'
}


interface Props {
    words: [],
    addWord: any;
    addRestaurantCode: any;
    darkTheme: any;
    fontSize: any;
    t: any;
}

interface State {
    searchText: string,
    searchFor: string,
    apiResponse: any,
    locationType: string,
    place: string,
    place_id: any,
    showFindKeyword: boolean;
    foodCategories: any[];
    cuisines: any[],
    showCuisines: boolean;
    count: number;
    countStart: number;
    totalResults: number;
    loading: string;
}

class Search extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            searchText: '',
            searchFor: '',
            apiResponse: null,
            locationType: '',
            place: '',
            place_id: 0,
            showFindKeyword: true,
            foodCategories: [],
            cuisines: [],
            showCuisines: false,
            count: 10,
            countStart: 1,
            totalResults: 0,
            loading: ""
        }
    }

    callApi = (location: any) => {

        this.setState({
            loading: "loading"
        })

        axios({
            method: "GET",
            url: `https://developers.zomato.com/api/v2.1/locations?query=${this.state.place}`,
            headers: {
                "user-key": "f2abf689ae3e8e47f244f65e60ad747e",
                "content-type": "application/json"
            }
        })
            .then(response => {
                // console.log(response.data.restaurants[0].restaurant.name);
                this.setState({
                    place_id: response.data.location_suggestions[0].entity_id
                }, () => {
                    axios({
                        method: "GET",
                        url: `https://developers.zomato.com/api/v2.1/search?entity_type=${this.state.locationType}&entity_id=${this.state.place_id}&q=${location}&start=${this.state.countStart}&count=${this.state.count}`,
                        headers: {
                            "user-key": "f2abf689ae3e8e47f244f65e60ad747e",
                            "content-type": "application/json"
                        }
                    }).then(response => {
                        // console.log(response.data.restaurants[0].restaurant.name);
                        this.setState({
                            apiResponse: response.data,
                            totalResults: response.data.results_found
                        }, () => {
                            this.setState({
                                loading: "loaded"
                            })
                        })


                        // console.log(response);
                    })
                        .catch(error => {
                            console.log(error);
                        });
                })
                console.log(response.data.location_suggestions[0].entity_id);
            })
            .catch(error => {
                console.log(error);
            })

        //For restaurant types
        axios({
            method: "GET",
            url: 'https://developers.zomato.com/api/v2.1/categories',
            headers: {
                "user-key": "f2abf689ae3e8e47f244f65e60ad747e",
                "content-type": "application/json"
            }
        }).then(response => {
            // console.log(response.data.restaurants[0].restaurant.name);
            this.setState({
                foodCategories: response.data.categories
            },
                () => {
                    console.log(this.state.foodCategories);
                })

        })
            .catch(error => {
                console.log(error);
            });


        axios({
            method: "GET",
            url: `https://developers.zomato.com/api/v2.1/cuisines?city_id=10`,
            headers: {
                "user-key": "f2abf689ae3e8e47f244f65e60ad747e",
                "content-type": "application/json"
            }
        }).then(response => {
            // console.log(response.data.restaurants[0].restaurant.name);
            this.setState({
                cuisines: response.data.cuisines
            },
                () => {
                    console.log(this.state.cuisines);
                })

        })
            .catch(error => {
                console.log(error);
            });



    }

    changeSearch = (e: any) => {
        this.setState({
            searchText: e.target.value
        })
    }

    searchWord = () => {

        console.log(this.state)

        this.setState({
            searchFor: this.state.searchText
        }, () => {

            this.callApi(this.state.searchFor)

        })
        this.props.addWord(this.state.searchText)

    }

    changePlace = (e: any) => {
        this.setState({
            place: e.target.value
        },

        )
    }

    changePage = (e: any) => {
        let change = e.target.id;



        if (change === "next") {
            if ((this.state.countStart + 10) < this.state.totalResults) {
                this.setState({
                    countStart: this.state.countStart + 10
                }, () => {
                    this.callApi(this.state.searchFor)
                })
            } else {
                console.log("At last Page")
            }

        } else {

            if (this.state.countStart !== 1) {
                this.setState({
                    countStart: this.state.countStart - 10
                }, () => {
                    this.callApi(this.state.searchFor)
                })
            } else {
                console.log("Already at page 1");
            }
        }
    }


    changeLocationType = (e: any) => {
        this.setState({
            locationType: e.target.value
        }, () => { console.log(this.state.locationType) })
    }

    selectCuisines = () => {
        if (this.state.showCuisines === false) {
            this.setState({
                showCuisines: true
            })
        } else {
            this.setState({
                showCuisines: false
            })
        }

    }

    orderNow = (e: any) => {

        this.props.addRestaurantCode(e.target.id);
        console.log("added to the state restaurant id " + e.target.id);
    }

    // titlee , search-input, search-button, search-history, place-input, location-type, filter-select, toggle-select,
    // filter-button


    showMeanings = () => {

        if (this.state.apiResponse !== null)
            // console.log(this.state.apiResponse)
            if (this.state.apiResponse !== null) {

                return (

                    <div className="show-meaning">

                        <div className="filter-box">
                            <div className="categories-filter-select">
                                <select className={`filter-select ${this.props.darkTheme ? "dark-filter-select" : ""} ${this.props.fontSize === "small" ? "small-search" : this.props.fontSize === "medium" ? "medium-search" : "large-search"}`}>
                                    {this.state.foodCategories.map(val => {
                                        return <option>{val.categories.name}</option>
                                    })}
                                </select>
                            </div>

                            <div className="select-box-filtration">

                                <div className="select-cuisines" onClick={this.selectCuisines}>
                                    <div className={`toggle-select ${this.props.fontSize === "small" ? "small-search" : this.props.fontSize === "medium" ? "medium-search" : "large-search"}`}><div>Select Cuisines</div>
                                        <div><img src="download.png" alt="expand" /></div>
                                    </div>
                                </div>

                                {this.state.showCuisines ?
                                    <div className={`cuisine-filter-check ${this.props.darkTheme ? "dark-cuisine-filter-check" : ""}`}>
                                        {this.state.cuisines.map(val => {
                                            return <div className="cuisine-box">{val.cuisine.cuisine_name} <input className="check-cuisine" value={val.cuisine.cuisine_name} type="checkbox" /></div>
                                        })}
                                    </div>
                                    : <div></div>
                                }

                            </div>

                            <div className={`filter-button ${this.props.fontSize === "small" ? "small-search" : this.props.fontSize === "medium" ? "medium-search" : "large-search"}`}>
                                Filter Results
                            </div>


                        </div>

                        <div className="table-container">
                            <table className={`search-table ${this.props.fontSize === "small" ? "small-table" : this.props.fontSize === "medium" ? "medium-table" : "large-table"}`}>
                                <tr>
                                    <th>Restaurant</th>
                                    <th>Name</th>
                                    <th>Average cost for two</th>
                                    <th>Address</th>
                                    <th>Timings</th>
                                    <th className="order-heading">Order Food</th>
                                </tr>
                                {this.state.apiResponse.restaurants.map((val: any) => {
                                    return (
                                        <React.Fragment>
                                            <tr>
                                                <td><img alt="restaurant" src={val.restaurant.thumb === "" ? "/na.png" : val.restaurant.thumb} /></td>
                                                <td>{val.restaurant.name}</td>
                                                <td>{val.restaurant.average_cost_for_two}</td>
                                                <td>{val.restaurant.location.address}</td>
                                                <td>{val.restaurant.timings}</td>
                                                <td><Link to="/order"><div className={`order-now ${this.props.darkTheme ? "dark-order-now" : ""}`} onClick={this.orderNow} id={val.restaurant.R.res_id}>Order Now</div></Link></td>
                                            </tr>
                                            {/* <tr></tr> */}
                                        </React.Fragment>
                                    )
                                })}

                            </table>
                        </div>


                        <div className="change-page-box">
                            <div className="change-button" id="previous" onClick={this.changePage}>Previous</div>
                            <div className="change-button" id="next" onClick={this.changePage}>Next</div>
                        </div>

                    </div>

                )
            }
    }

    componentDidMount() {
        console.log(this.props.darkTheme)
    }

    render() {

        const { t } = this.props;

        return (
            <motion.div

                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariant}
                transition={pageTrans}
                className={`search-container
                
                 `}
            >
                <div className={`search ${this.props.darkTheme ? "dark-search" : ""}`}>

                    <div className={`titlee ${this.props.darkTheme ? "dark-text" : ""} ${this.props.fontSize === "small" ? "small-search" : this.props.fontSize === "medium" ? "medium-search" : "large-search"}`}>{t('searchTitle')}</div>

                    <div className="location-box">


                        <select className={`location-type ${this.props.darkTheme ? "dark-select-input" : ""} ${this.props.fontSize === "small" ? "small-search" : this.props.fontSize === "medium" ? "medium-search" : "large-search"}`} onChange={this.changeLocationType} value={this.state.locationType}>
                            <option value="">
                                {t('locationType')}
                            </option>
                            <option value="city">
                                {t('city')}
                            </option>
                            <option value="subzone">
                                {t('subZone')}
                            </option>
                            <option value="zone">
                                {t('zone')}
                            </option>
                            <option value="landmark">
                                {t('landmark')}
                            </option>
                            <option value="metro">
                                {t('metro')}
                            </option>
                            <option value="group">
                                {t('group')}
                            </option>
                        </select>

                        <input className={`place-input ${this.props.darkTheme ? "dark-input" : ""} ${this.props.fontSize === "small" ? "small-search" : this.props.fontSize === "medium" ? "medium-search" : "large-search"}`} type="text" placeholder={t('enterPlace')} onChange={this.changePlace} value={this.state.place} />

                    </div>


                    {this.state.showFindKeyword ?
                        <div className={this.props.darkTheme ? "dark-background" : ""}>

                            <div className="search-input-div"><input className={`search-input ${this.props.darkTheme ? "dark-input" : ""} ${this.props.fontSize === "small" ? "small-search" : this.props.fontSize === "medium" ? "medium-search" : "large-search"}`} onChange={this.changeSearch} value={this.state.searchText} type="text" placeholder={t('restCafeEtc')} /></div>

                            <div className={`search-button ${this.props.fontSize === "small" ? "small-search" : this.props.fontSize === "medium" ? "medium-search" : "large-search"}`} onClick={this.searchWord}>
                                <strong>{t('find')}</strong>
                            </div>

                            {this.state.loading === "loading" ?
                                <div>
                                    <img className="loading-image" src="831.svg" alt="Loading..." />
                                </div>
                                : this.state.loading === "loaded" ?
                                    <motion.div
                                        initial="out"
                                        animate="in"
                                        exit="out"
                                        variants={searchesVariant}
                                        transition={
                                            {
                                                duration: 2
                                            }
                                        }
                                    >
                                        {this.showMeanings()}
                                    </motion.div>
                                    : <div></div>}


                            {this.props.words.length !== 0 ? <div className="search-history-box"><div>Search History</div><br />
                                <div className={`search-history ${this.props.fontSize === "small" ? "small-search" : this.props.fontSize === "medium" ? "medium-search" : "large-search"}`}>

                                    {this.props.words.map((val: any) => {

                                        return <div>{val}</div>
                                    })}

                                </div></div> : <div></div>
                            }

                        </div> : <div>
                            <div className="dine-image-box"><img className="dine-image" src="/dining.jpg" alt="dine" /></div>
                        </div>
                    }

                </div>
            </motion.div>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        words: state.words,
        restaurant_id: state.restaurant_id,
        darkTheme: state.darkTheme,
        fontSize: state.fontSize
    };
};


function mapDispatchToProps(dispatch: any) {
    return {
        addWord: (addword: any) => dispatch(addWord(addword)),
        addRestaurantCode: (addrestaurant: any) => dispatch(addRestaurantCode(addrestaurant))
    };
}

export default (withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Search)));