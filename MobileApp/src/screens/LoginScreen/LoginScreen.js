import * as React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native'
import { facebookLogin } from '../../components/FaceBookLogin/FaceBookLogin'
import { googleLogin } from '../../components/GoogleLogin/GoogleLogin'
import Icon from 'react-native-vector-icons/FontAwesome';
import {COVER, LOGO} from '../../images/index'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { generateUUID } from '../../components/UserDataHandling/UserDataHandling';
class LoginScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Sign In',
            headerStyle: {
                backgroundColor: '#4b8b3b',
            },
            headerTintColor: '#fff',
        }
    }

    constructor(props) {
        super(props)
        this.state={
            signFb: false,
            signGoogle: false,
            signPhone: false,
        }
    }

    componentDidMount(){
        if(!this.state.signPhone){
            auth().onAuthStateChanged(async user => {
                if (user) {
                    const uid = user.uid;
                    const ref = database().ref('/users/').child(uid);
                    
                    const name = user.displayName!==null?user.displayName:''
                    const email = user.email!==null?user.email:''
                    const photo = user.photoURL!==null?user.photoURL:''
                    const phone = user.phoneNumber!==null?user.phoneNumber:''
    
                    await ref.set({
                        name: name,
                        email: email,
                        photo: photo,
                        phone: phone,
                        profile: 'user'
                    });
    
                    this.props.navigation.navigate('App')
                }
            });
        }
        
    }

    facebookLoginBtnHandler = (navigate) => {
        this.setState({signFb: true})
        facebookLogin(navigate)
    }

    GoogleLoginBtnHandler = (navigate) => {
        this.setState({signGoogle: true})
        googleLogin(navigate)
    }

    phoneLoginBtnHandler = ()=>{
        this.setState({signPhone: true})
        this.props.navigation.navigate('Phone')
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={COVER}
                    style={styles.imgConatiner}
                >
                    <View style={styles.logoBtnCntner}>
                        <View style={styles.logoIconContainer}>
                            <Image source={LOGO} style={styles.logo} />
                            <Text style={styles.logoText}>Elly</Text>
                        </View>
                        <View style={styles.btnContainer}>
                            <Icon.Button
                                style={styles.btn}
                                name="facebook"
                                backgroundColor="#3b5998"
                                onPress={() => this.facebookLoginBtnHandler(navigate)}
                            >
                                Login with Facebook
                            </Icon.Button>
                        </View>
                        <View style={styles.btnContainer}>
                            <Icon.Button
                                style={styles.btn}
                                name="google"
                                backgroundColor="#DD4B39"
                                onPress={() => this.GoogleLoginBtnHandler(navigate)}
                            >
                                Login with Google
                            </Icon.Button>
                        </View>
                        <View style={styles.btnContainer}>
                            <Icon.Button
                                style={styles.btn}
                                name="phone"
                                backgroundColor="grey"
                                onPress={() => this.phoneLoginBtnHandler()}
                            >
                                Login with Phone Number
                            </Icon.Button>
                        </View>

                    </View>

                </ImageBackground>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
        width: Dimensions.get('window').width
    },
    btnContainer: {
        padding: 3,
        marginBottom: 3,
        backgroundColor: 'white',
        borderRadius: 10
    },
    btn: {
        width: Dimensions.get('window').width - 80,
        height: 60,
    },
    logoIconContainer: {
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: 25
    },
    logo: {
        width: 70,
        height: 50
    },
    logoText: {
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 20
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        alignSelf: 'stretch',
        alignItems: 'center',
        marginBottom: 20
    },
    imgConatiner: {
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height,
    },
    logoBtnCntner: {
        height: 400,
        borderRadius: 50,
        // backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 20,
        width: Dimensions.get('window').width - 40
    }
})
export default LoginScreen;

