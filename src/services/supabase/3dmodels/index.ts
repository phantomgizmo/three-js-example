import supabaseClient from '..';

const getModels = async () => {
  return supabaseClient
    .from('3dmodels')
    .select()
    .then((res) => {
      return res.data;
    });
};

const getModelByFilename = async (filename: string) => {
  return supabaseClient.storage
    .from('3dmodels')
    .download(filename)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export { getModelByFilename, getModels };
