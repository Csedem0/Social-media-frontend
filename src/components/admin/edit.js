import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { useHistory, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Edit() {
  const history = useHistory();
  const { id } = useParams();
  const classes = useStyles();

  const [formData, setFormData] = useState({
    author: 1,
    title: '',
    slug: '',
    excerpt: '',
    content: '',
  });

  useEffect(() => {
    axiosInstance.get(`admin/edit/${id}/`)
      .then((res) => {
        const { title, excerpt, slug, content } = res.data;
        setFormData({ title, excerpt, slug, content });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value.trim(), // Trim any whitespace
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance.put(`admin/edit/${id}/`, formData)
      .then(() => {
        console.log('Post updated successfully!');
		window.alert("Post updated successfully");
      })
      .catch((error) => {
        console.error('Error updating post:', error);
      });
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Edit Post
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="title"
                label="Post Title"
                name="title"
                autoComplete="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="excerpt"
                label="Post Excerpt"
                name="excerpt"
                autoComplete="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                multiline
                rows={8}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="slug"
                label="Slug"
                name="slug"
                autoComplete="slug"
                value={formData.slug}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="content"
                label="Content"
                name="content"
                autoComplete="content"
                value={formData.content}
                onChange={handleChange}
                multiline
                rows={8}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Update Post
          </Button>
        </form>
      </div>
    </Container>
  );
}
