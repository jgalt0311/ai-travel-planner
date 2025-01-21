const { NlpManager } = require('node-nlp');
const natural = require('natural');
const tf = require('@tensorflow/tfjs');
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

class AIService {
  constructor() {
    this.nlpManager = new NlpManager({ languages: ['en'] });
    this.tfidf = new TfIdf();
    this.sentimentAnalyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    this.initializeNLP();
  }

  async initializeNLP() {
    // Train NLP manager with travel-specific phrases and intents
    await this.trainTravelIntents();
    await this.nlpManager.train();
  }

  async trainTravelIntents() {
    // Add travel-specific intents and training data
    this.nlpManager.addDocument('en', 'I want to visit %place%', 'travel.destination');
    this.nlpManager.addDocument('en', 'Plan a trip to %place%', 'travel.destination');
    this.nlpManager.addDocument('en', 'Show me activities in %place%', 'travel.activities');
    
    // Add more training data for different travel styles
    this.nlpManager.addDocument('en', 'I want adventure activities', 'travel.style.adventure');
    this.nlpManager.addDocument('en', 'Looking for relaxing vacation', 'travel.style.relaxation');
    this.nlpManager.addDocument('en', 'Cultural experiences', 'travel.style.culture');
    
    // Add entities for places, activities, etc.
    this.nlpManager.addNamedEntityText('place', 'Paris', ['en'], ['Paris', 'paris', 'Paris, France']);
    this.nlpManager.addNamedEntityText('place', 'London', ['en'], ['London', 'london', 'London, UK']);
    // Add more places as needed
  }

  async analyzeSentiment(text) {
    // Perform sentiment analysis on reviews or user input
    const tokens = tokenizer.tokenize(text);
    const sentiment = this.sentimentAnalyzer.getSentiment(tokens);
    
    return {
      score: sentiment,
      label: this.getSentimentLabel(sentiment),
      tokens: tokens
    };
  }

  getSentimentLabel(score) {
    if (score > 0.3) return 'positive';
    if (score < -0.3) return 'negative';
    return 'neutral';
  }

  async generateActivityRecommendations(userPreferences, destination, existingActivities = []) {
    // Calculate user preference vector
    const preferenceVector = this.createPreferenceVector(userPreferences);
    
    // Get activities for the destination
    const activities = await this.getDestinationActivities(destination);
    
    // Calculate similarity scores
    const recommendations = activities.map(activity => {
      const activityVector = this.createActivityVector(activity);
      const similarity = this.calculateCosineSimilarity(preferenceVector, activityVector);
      return { ...activity, score: similarity };
    });

    // Filter out existing activities and sort by score
    const filteredRecommendations = recommendations
      .filter(rec => !existingActivities.includes(rec.id))
      .sort((a, b) => b.score - a.score);

    return filteredRecommendations.slice(0, 10); // Return top 10 recommendations
  }

  createPreferenceVector(preferences) {
    // Convert user preferences into a numerical vector
    // This is a simplified version - expand based on your preference categories
    return tf.tensor([
      preferences.adventure || 0,
      preferences.culture || 0,
      preferences.relaxation || 0,
      preferences.budget || 0.5,
      preferences.intensity || 0.5
    ]);
  }

  createActivityVector(activity) {
    // Convert activity attributes into a numerical vector
    // Match the dimensions with preference vector
    return tf.tensor([
      activity.adventureScore || 0,
      activity.culturalScore || 0,
      activity.relaxationScore || 0,
      activity.priceLevel || 0.5,
      activity.intensityLevel || 0.5
    ]);
  }

  calculateCosineSimilarity(vectorA, vectorB) {
    // Calculate cosine similarity between two vectors
    const dotProduct = vectorA.dot(vectorB);
    const normA = vectorA.norm();
    const normB = vectorB.norm();
    return dotProduct.div(normA.mul(normB)).dataSync()[0];
  }

  async optimizeItinerary(itinerary) {
    // Optimize the order of activities in the itinerary
    for (const day of itinerary.days) {
      day.activities = await this.optimizeDaySchedule(day.activities);
    }
    return itinerary;
  }

  async optimizeDaySchedule(activities) {
    // Simple greedy algorithm to optimize activity order based on location and timing
    const optimized = [...activities];
    optimized.sort((a, b) => {
      // Consider multiple factors:
      // 1. Opening hours
      // 2. Distance between activities
      // 3. Popular visit times
      // 4. Duration of activities
      
      // This is a simplified version - implement more sophisticated logic
      return a.startTime - b.startTime;
    });
    
    return optimized;
  }

  async analyzeUserFeedback(feedback) {
    // Analyze user feedback to improve recommendations
    const sentiment = await this.analyzeSentiment(feedback.text);
    const tokens = tokenizer.tokenize(feedback.text);
    
    // Extract key topics from feedback
    const topics = this.extractTopics(tokens);
    
    return {
      sentiment,
      topics,
      suggestions: await this.generateSuggestions(sentiment, topics)
    };
  }

  extractTopics(tokens) {
    // Use TF-IDF to identify important topics in the feedback
    this.tfidf.addDocument(tokens);
    const topics = [];
    
    this.tfidf.listTerms(0 /*document index*/).forEach(item => {
      if (item.tfidf > 0.5) { // Adjust threshold as needed
        topics.push({
          term: item.term,
          score: item.tfidf
        });
      }
    });
    
    return topics;
  }

  async generateSuggestions(sentiment, topics) {
    // Generate personalized suggestions based on sentiment and topics
    const suggestions = [];
    
    if (sentiment.label === 'negative') {
      // Generate alternative recommendations
      topics.forEach(topic => {
        suggestions.push({
          type: 'alternative',
          topic: topic.term,
          suggestion: `Consider alternative ${topic.term} options`
        });
      });
    }
    
    return suggestions;
  }
}

module.exports = new AIService();