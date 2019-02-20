import React from 'react';

export default React.createContext({
    token: '',
    userId: null,
    login: () => {},
    logout: () => {}
})