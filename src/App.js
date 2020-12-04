import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Components/Post';
import { db, auth } from './Firebase/firebase';
import { Modal, makeStyles, Button, Input } from '@material-ui/core';
import ImageUpload from './Components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function App() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log(authUser);
                setUser(authUser);
            } else {
                setUser(null);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [user, username]);

    useEffect(() => {
        db.collection('posts')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setPosts(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        post: doc.data(),
                    })),
                );
            });
    }, []);

    const signUp = (event) => {
        event.preventDefault();

        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username,
                });
            })
            .catch((err) => alert(err.message));

        setOpen(false);
    };

    const signIn = (event) => {
        event.preventDefault();

        auth.signInWithEmailAndPassword(email, password).catch((err) =>
            alert(err.message),
        );

        setOpenSignIn(false);
    };

    return (
        <div className='app'>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <form className='app__signup'>
                        <center>
                            <img
                                className='app__headerImage'
                                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                                alt='Insta Logo'
                            />
                        </center>
                        <Input
                            placeholder='username'
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            placeholder='email'
                            type='text'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder='password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button onClick={signUp}>Sign Up</Button>
                    </form>
                </div>
            </Modal>
            <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <form className='app__signup'>
                        <center>
                            <img
                                className='app__headerImage'
                                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                                alt='Insta Logo'
                            />
                        </center>
                        <Input
                            placeholder='email'
                            type='text'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder='password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button onClick={signIn}>Sign In</Button>
                    </form>
                </div>
            </Modal>
            <div className='app__header'>
                <img
                    className='app__headerImage'
                    src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                    alt='Insta Logo'
                />
                {user ? (
                    <Button onClick={() => auth.signOut()}>Logout</Button>
                ) : (
                    <div className='app__loginContainer'>
                        <Button onClick={() => setOpenSignIn(true)}>
                            Sign In
                        </Button>
                        <Button onClick={() => setOpen(true)}>Sign Up</Button>
                    </div>
                )}
            </div>
            <div className='app__posts'>
                <div className='app__postsLeft'>
                    {posts.map(({ id, post }) => (
                        <Post
                            key={id}
                            postId={id}
                            username={post.username}
                            caption={post.caption}
                            imageUrl={post.imageUrl}
                            user={user}
                        />
                    ))}
                </div>
                <div className='app__postsRight'>
                    <InstagramEmbed
                        url='https://www.instagram.com/p/BucMXT-hu4X/'
                        clientAccessToken='320930625552281|ab393f58ee1c8640b27b5d8ec7b968c6'
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {}}
                    />
                </div>
            </div>
            {user?.displayName ? (
                <ImageUpload username={user.displayName} />
            ) : (
                <h3>Sorry, you need to login to Upload</h3>
            )}
        </div>
    );
}

export default App;
