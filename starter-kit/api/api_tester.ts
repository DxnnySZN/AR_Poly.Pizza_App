import { searchModels, getModelById, getModelsByUser } from './api_service';

const testApi = async () => {
  console.log('Testing searchModels...');
  const searchResults = await searchModels('cat', { category: 7 });
  console.log('Search Results:', searchResults);

  if (searchResults.length > 0) {
    console.log('Testing getModelById...');
    const modelDetails = await getModelById(searchResults[0].ID);
    console.log('Model Details:', modelDetails);
  }

  console.log('Testing getModelsByUser...');
  const userModels = await getModelsByUser('dook');
  console.log('User Models:', userModels);
};

testApi();