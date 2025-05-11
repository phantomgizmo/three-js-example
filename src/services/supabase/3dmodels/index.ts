import supabaseClient from '..';

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

export { getModelByFilename };
