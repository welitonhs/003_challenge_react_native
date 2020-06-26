import React, {useEffect, useState} from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(()=>{
    (async function getRepositories(){
      const response = await api.get('/repositories');
      const currentRepositories = response.data;
      setRepositories(currentRepositories);
    })();  
  },[]);

  async function handleAddRepository(){
    const response = await api.post('/repositories', {
      "title": "Repo challange React Native",
      "url": "10.0.0.2:3333/app",
      "techs": ["REACT NATIVE", "IS", "TRUE" ]
    });
    setRepositories([...repositories, response.data]);
  }

  async function handleLikeRepository(id) {
    const response = await api.post(`/repositories/${id}/like`);
    if(response.status === 200){
      const updatedRepository = response.data;
      const currentRepositories = repositories.filter(repo => repo.id !== id);
      setRepositories([...currentRepositories, updatedRepository]);
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repo => repo.id}
          renderItem={({ item: repo }) => (
            <View style={styles.repositoryContainer}>
            <Text style={styles.repository}>{repo.title}</Text>
            
            <View style={styles.techsContainer}>
              {repo.techs.map((tech, index) => (
                    <Text key={index} style={styles.tech}>
                      {tech}
                    </Text>
              ))}
            </View>
  
            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                testID={`repository-likes-${repo.id}`}
              >
                {repo.likes} curtidas
              </Text>
            </View>
  
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLikeRepository(repo.id)}
              // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
              testID={`like-button-${repo.id}`}
            >
              <Text style={styles.buttonText}>Curtir</Text>
            </TouchableOpacity>
          </View>
          )}
        />

        <TouchableOpacity 
          activeOpacity={0.5} 
          style={styles.buttonAdd} 
          onPress={handleAddRepository}
        > 
          <Text style={styles.buttonAddText}>Adicionar Projeto</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  buttonAdd:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    height: 50,
    borderRadius: 4
  },
  buttonAddText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#7159c1'
  }
});
