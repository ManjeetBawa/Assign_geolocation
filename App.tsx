import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  PermissionsAndroid,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import styles from './style';
import Geocoder from 'react-native-geocoder';
import Swiper from 'react-native-swiper';
// Function to get permission for location
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

const App = () => {
  // state to hold location
  const [location, setLocation] = useState(false);
  const [address, setaddress] = useState('');
  // function to check permissions and get Location
  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
        const lat = 40.7809261;
        const lng = -73.9637594;
        Geocoder.geocodePosition({lat: lat, lng: lng}).then(respo => {
          setaddress(respo);
          console.log(respo[0].adminArea);
        });
      }
    });
    console.log(location);
  };

  const dishes = [
    {
      image:
        'https://images.pexels.com/photos/2059151/pexels-photo-2059151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      image:
        'https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg?w=1380&t=st=1681296083~exp=1681296683~hmac=f59ed6ff4566d24ddd0541cb3a8fda4e6b158981b57166d9ba18e3195b0463d0',
    },
    {
      image:
        'https://img.freepik.com/free-photo/club-sandwich-with-side-french-fries_140725-1744.jpg?w=1380&t=st=1681296057~exp=1681296657~hmac=01c02decce92671da303d61a41449b835c13950f7e2f1d1e1c16b79d67923d16',
    },
  ];

  const renderItem = ({item}) => {
    return (
      <View>
        <Image
          style={{height: 90, width: 90, marginRight: 10, borderRadius: 50}}
          source={{uri: item.strCategoryThumb}}
        />
      </View>
    );
  };

  const [food, setFood] = useState([]);

  const getFood = async () => {
    const foodres = await fetch(
      'http://www.themealdb.com/api/json/v1/1/categories.php',
    );

    const foodresJSON = await foodres.json();
    setFood(foodresJSON.categories);
  };

  useEffect(() => {
    getFood();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Welcome!</Text>
      <View>
        <TouchableOpacity onPress={getLocation} style={styles.bttn}>
          <Text>Get location</Text>
        </TouchableOpacity>
      </View>
      <Text>Latitude: {location ? location.coords.latitude : null}</Text>
      <Text>Longitude: {location ? location.coords.longitude : null}</Text>

      <FlatList data={food} renderItem={renderItem} horizontal={true} />
      <Text>Position: {address ? address[0].adminArea : null}</Text>

      <Swiper style={styles.wrapper} showsButtons={true} autoplay>
        <View style={styles.slide1}>
          {/* <Text style={styles.text}>Hello Swiper</Text> */}
          <Image
            style={{width: '100%', height: '100%'}}
            source={{
              uri: dishes[0].image,
            }}
          />
        </View>
        <View style={styles.slide2}>
          <Image
            style={{width: '100%', height: '100%'}}
            source={{
              uri: dishes[1].image,
            }}
          />
        </View>
        <View style={styles.slide3}>
          <Image
            style={{width: '100%', height: '100%'}}
            source={{
              uri: dishes[2].image,
            }}
          />
        </View>
      </Swiper>
    </View>
  );
};

export default App;
