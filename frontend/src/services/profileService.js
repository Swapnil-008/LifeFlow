import api from './api';

const profileService = {
  update: ({ name, bio, avatarFile }) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio || '');
    if (avatarFile) formData.append('avatar', avatarFile);

    return api.put('/profile', formData).then((res) => res.data);
  },
  changePassword: (payload) => api.put('/profile/password', payload).then((res) => res.data),
};

export default profileService;
