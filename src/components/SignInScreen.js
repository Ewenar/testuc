import {View, Text, Image, StyleSheet,Button, TextInput, Touchable, Alert, TouchableOpacity, Keyboard, ScrollView, ActivityIndicator} from 'react-native';
import React, {useState, useContext} from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import LoginContainer from './Login/LoginContainer';
import LogoutPower from './Login/LogoutPower';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {colors} from './DarkMode/colors';
import '../../languages/i18n';
import { useTranslation } from 'react-i18next';


const SignInScreen = ({navigation}) => {

  const {t, i18n} = useTranslation();

  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];

  const [loading, setLoading] = useState(false);

  {/*Date Picker*/}
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [birthDate, setBirthDate] = useState(undefined);

  {/*Validation*/}
  const [inputs, setInputs] = useState({name:'', id:'', date:'', email:'', firstPassword:'', secondPassword:''});
  const [errors, setErrors] = useState({});


  const validate = () => {

    Keyboard.dismiss();

    let valid = true;

    if (!inputs.name) {
      handleError('NAME FAILLLL', 'name');
      valid = false;
    }

    if (!inputs.id) {
      handleError('ID FAILLLL', 'id');
      valid = false;
    }
    else if (inputs.id.length < 11) {
      handleError('ID cannot be less than 11 characters', 'id');
      valid = false;
    }

    if (!inputs.email) {
      handleError('EMAIL FAILLLL', 'email');
      valid = false;
    }
    else if (!inputs.email) {
      handleError('EMAIL FAILLLL', 'email');
      valid = false;
    }

    if (!inputs.firstPassword) {
      handleError('Password FAILLLL', 'firstPassword');
      valid = false;
    }
    else if (inputs.secondPassword.length < 6) {
      handleError('Password cannot be less than 6 characters', 'firstPassword');
      valid = false;
    }

    if (!inputs.secondPassword) {
      handleError('Password FAILLLL', 'secondPassword');
      valid = false;
    }
    else if (inputs.secondPassword.length < 6) {
      handleError('Password cannot be less than 6 characters', 'secondPassword');
      valid = false;
    }

    if (inputs.firstPassword !== inputs.secondPassword){
      handleError('Passwords cannot be match', 'firstPassword');
      valid = false;
    }

    if (valid){
      //sendContent();
      register();
    }
  };

  const register = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      try {
        AsyncStorage.setItem('users', JSON.stringify(inputs));
        goToLoginScreen();
      } catch (error) {
        Alert.error('ERROR', 'Something went wrong');
      }
    }, 3000);
  };

  const handleOnChange = (text, input) => {

    setInputs(prevState => ({...prevState, [input]:text}));

  };

  const handleError = (errorMessage, input) => {

    setErrors(prevState => ({...prevState, [input]:errorMessage}));

  };

  function goToWelcomeScreen() {
    navigation.navigate("Welcome");
  };

  function goToLoginScreen() {
    navigation.navigate("Home");
  };


  //DATABASE
  function sendContent() {
    const contentObj = {
      name: inputs.name,
      id: inputs.id,
      email: inputs.email,
      firstPassword: inputs.firstPassword,
    };

    database().ref('users/').push(contentObj);
    console.log(contentObj);
  }


  return (
    <SafeAreaView style={[styles.root, {backgroundColor: activeColors.primary}]}>

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={{paddingHorizontal:65}}>

        <LogoutPower name={'power'} onPress={goToWelcomeScreen} style={{marginTop:40, marginLeft:-30, color: activeColors.tint }}/> 

        <View style={{margin:20}}>
          <Text style={[styles.title, {color: activeColors.tint}]} >{t('signInTexts.Register')}</Text>
        </View>

        {/*Entry Field*/}

          <View>
            <LoginContainer iconName="person-outline" placeholderTextColor="grey" placeholder={t('signInPlaceholder.Fullname')} error={errors.name} onFocus={() => {handleError(null, 'name')}} onChangeText={text => handleOnChange(text, 'name')} />
          </View>

          <View>
            <LoginContainer iconName="phone-portrait-sharp" placeholderTextColor="grey" placeholder={t('signInPlaceholder.ID')} maxLength={11} error={errors.id} onFocus={() => {handleError(null, 'id')}} onChangeText={text => handleOnChange(text, 'id')}/>
          </View>

          {/*<View style={styles.inputContainer}>

            <Entypo name="calendar" size={20} color='#666' style={{marginRight: 5}} />
            <TouchableOpacity onPress={() => setOpen(true)} style={{flex:1, paddingVertical: 5}}><Text style={{paddingLeft: 5, color:'grey'}} >{birthDate === undefined ? 'Date of Birth ' : birthDate}</Text></TouchableOpacity>

          </View>

          {/*Date Picker}

            <DatePicker
                modal
                open={open}
                date={date}
                mode={'date'}
                minimumDate={new Date('1999-01-01')}
                maximumDate={new Date('2023-01-01')}
                locale={'tr'}
                title={'Date of Birth'}
                onConfirm={(date) => {
                setOpen(false);
                setDate(date);
                setBirthDate(date.toDateString());
                }}
                onCancel={() => {
                setOpen(false);
                }}
            /> */}

          {/*End of Date Picker*/}

          <View>
            <LoginContainer iconName="mail-outline" placeholderTextColor="grey" placeholder={t('signInPlaceholder.Email')} error={errors.email} onFocus={() => {handleError(null, 'email')}} onChangeText={text => handleOnChange(text, 'email')}/>
          </View>

          <View>
            <LoginContainer iconName="ios-lock-closed-outline" placeholderTextColor="grey" placeholder={t('signInPlaceholder.Password')} error={errors.firstPassword} onFocus={() => {handleError(null, 'firstPassword')}} onChangeText={text => handleOnChange(text, 'firstPassword')}/>
          </View>

          <View>
            <LoginContainer iconName="ios-lock-closed-outline" placeholderTextColor="grey" placeholder={t('signInPlaceholder.PasswordAgain')} error={errors.secondPassword} onFocus={() => {handleError(null, 'secondPassword')}} onChangeText={text => handleOnChange(text, 'secondPassword')}/>
          </View>


          {/*Button Action*/}

          {
            loading
              ? <ActivityIndicator size="large"/>

              :  <TouchableOpacity style={styles.touchableButton} onPress={validate}>
                  <Text style={styles.touchableText}>{t('signInButton.SignIn')}</Text>
                </TouchableOpacity>
          }

          <View>
            <Text style={[styles.textCenter, {color: activeColors.tint}]}>{t('signInTexts.SignInWith')}</Text>
          </View>

          <View style={styles.pngRow}>

            <TouchableOpacity style={styles.pngButton}>
              <Image
                source={require('./../../assets/google.png')}
                style={styles.pngPicture}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.pngButton}>
              <Image
                source={require('./../../assets/twitter.png')}
                style={styles.pngPicture}
              />
            </TouchableOpacity>

          </View>

          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              marginTop: 20,
              flexDirection:'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>

            <Text style={{textAlign:'center', marginBottom:20, color: activeColors.tint }}> {t('signInTexts.AlreadyAccount')} </Text>

            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Text style={{color: '#0065ff', marginLeft: 3, marginBottom:20}}>{t('signInTexts.LoginNavigate')}</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default SignInScreen

const styles = StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'center',
    },

    title: {
      fontSize: 28,
      fontWeight: '500',
      marginBottom: 15,
      textAlign: 'center',
      marginTop: -30,
    },

    inputContainer:{
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      paddingHorizontal: 8,
      paddingBottom:8,
      marginBottom: 10,
      marginTop: 10,
    },

    input:{
      flex: 1,
    },

    touchableButton: {
      marginTop: 5,
      marginBottom: 15,
      borderRadius: 5,
      padding: 20,
      backgroundColor: '#0065ff',
    },

    touchableText:{
      textAlign: 'center',
      fontWeight: 700,
      fontSize: 16,
      color: '#fff',
    },

    textCenter:{
      textAlign: 'center',
      fontWeight: 700,
      fontSize: 16,
    },

    pngRow:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },

    pngButton:{
      borderColor:'#ddd',
      borderWidth: 2,
      borderRadius: 10,
      paddingHorizontal: 30,
      paddingVertical: 10,
    },

    pngPicture:{
      width:24,
      height:24,
    },

  });