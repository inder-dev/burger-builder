import axios, { create} from 'axios';
export const instance = create({
    baseUrl: 'https://react-my-burger-89734.firebaseio.com/'
});

export default instance;