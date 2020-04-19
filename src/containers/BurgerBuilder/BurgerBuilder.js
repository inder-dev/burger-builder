import React, {Component} from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerBuilderActions from '../../store/actions/index';

//const INGREDIENT_PRICES = {
//        salad: .5,
//        cheese: .4,
//        meat: 1.3,
//        bacon: 0.7
//    };
    
class BurgerBuilder extends Component {
    state = {
//        ingredients: null, removed as using redux now
//        totalPrice: 4, fetching through the redux in the bottom of this page
//        purchasable: false,
        purchasing: false
    };
    
    componentDidMount () {
        this.props.onInitIngredients();
    }
    
    updatePurchaseState (updatedIngredients) {
        const ingredients = updatedIngredients;
        const sum = Object. keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
//        this.setState({purchaseable: sum > 0}); redux changes
        return sum > 0;
    }
    
//    addIngredientHandler = (type) => { **Removed as implemented the redux
//        //we are no longer using in ingredientAdded below as we are using redux
//        const oldCount = this.state.ingredients[type];
//        const updatedCount = oldCount + 1;
//        const updatedIngredients = {
//            ...this.state.ingredients
//        };
//        updatedIngredients[type] = updatedCount;
//        const priceAddition = INGREDIENT_PRICES[type];
//        const oldPrice = this.state.totalPrice;
//        const newPrice = oldPrice + priceAddition;
//        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
//        this.updatePurchaseState(updatedIngredients);
//    }
//    
//    removeIngredientHandler = (type) => {
//        //we are no longer using in ingredientRemoved below as we are using redux
//        const oldCount = this.state.ingredients[type];
//        if (oldCount <= 0) {
//            return;
//        }
//        const updatedCount = oldCount - 1;
//        const updatedIngredients = {
//            ...this.state.ingredients
//        };
//        updatedIngredients[type] = updatedCount;
//        const priceDeduction = INGREDIENT_PRICES[type];
//        const oldPrice = this.state.totalPrice;
//        const newPrice = oldPrice - priceDeduction;
//        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
//        this.updatePurchaseState(updatedIngredients);
//    }
    
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }
    
    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    
    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
//        const queryParams = []; ***commented after redux implementation
//        for (let i in this.state.ingredients) {
//            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
//        }
//        queryParams.push('price=' + this.state.totalPrice);
//        const queryString = queryParams.join('&');
//        this.props.history.push({
//            pathname: '/checkout',
//            search: '?' + queryString
//        });
    }
    
    render(){
        const disabledInfo = {
                //...this.state.ingredients //commented for redux
                ...this.props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
            
        let orderSummary = null;        
        
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
        
        //if (this.state.ingredients ){ //redux
        if (this.props.ings ){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls
                        ingredientAdded={this.props.onIngredientsAdded}
                        ingredientRemoved={this.props.onIngredientsRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchaseable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}/>
                </Aux>
            );
        
//updated the this.state.price to this.props.price as fetching through the redux up and below

            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                price={this.props.price}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}/>;
        }
        
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>  
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientsAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientsRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));