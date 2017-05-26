# node-raspberry-pi-skeeball

A neat little skeeball program for a raspberry pi.

While the program works reasonably well, I should note
here that I am a total newbie at the Raspberry Pi, so
if you are having trouble with any steps in here I am
probably not going to be able to help you much, if at
all.

Still, you're welcome to ask questions by opening issues
in this repo, and if I know anything about it I'll try
to help you out.

## setup the raspberry pi

First get the pi booted up with raspbian:

* [img download](https://www.raspberrypi.org/downloads/)
* [install instructions](https://www.raspberrypi.org/documentation/installation/installing-images/README.md)
* [use etcher](https://etcher.io/) to copy to SD card

## install nodejs

You need to install nodejs, but if you've got an old pi
you have to do it the hard way:

```bash
mkdir ~/node
cd ~/node
wget https://nodejs.org/dist/v6.10.3/node-v6.10.3-linux-armv6l.tar.gz
tar xvf node-v6.10.3-linux-armv6l.tar.gz
ln -s node-v6.10.3-linux-armv6l/bin current
```

Then add to your `$PATH` by editing `~/.profile` (nano seems
to be more responsive than vi, for some reason).

Add this to your `~/.profile` file:

```bash
export PATH=$PATH:~/node/current
```

If you run `source ~/.profile` it will rerun that, so now
if you do `node -v` it should say `6.10.3` and `npm -v`
should say `3.10.10` (or something like that).

## install git

Raspbian doesn't come with git installed, and you'll want that
to install this skeeball program.

It's as simple as:

```bash
sudo apt-get update
sudo apt-get install git
```

## possibly update some things

(Based on [this guide](https://github.com/fivdi/onoff/wiki/Node.js-v4-and-native-addons).)

You've got the gcc and g++ compiler installed, and you'll need
them so that the program can monitor the input/output pins, but
they might not be a recent enough version. To check, run:

```bash
gcc --version
g++ --version
```

If the version is less than 4.8 you will need to update. To do
so, run this:

```bash
sudo apt-get update
sudo apt-get install gcc-4.8 g++-4.8
```

Then set 4.8 as your default version:

```bash
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 20
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 50
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.6 20
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 50
```

Check that you have the correct version available using the `--version`
flags again. They should say 4.8

If you ever need to undo that, just go like:

```bash
sudo update-alternatives --config gcc
sudo update-alternatives --config g++
```

### clone this repo

Now you can install this skeeball program!

```
cd ~
git clone https://github.com/saibotsivad/node-raspberry-pi-skeeball.git
cd node-raspberry-pi-skeeball
npm install
```

## start it

You can run it using:

```bash
npm run start
```

## make it easier to update

You can add a script that will make it easier to update
this program:

```bash
touch ~/update.sh
chmod +x ~/update.sh
nano ~/update.sh
```

Then paste this in:

```bash
#!/bin/bash
cd node-raspberry-pi-skeeball
git fetch origin
git reset --hard
git rebase origin/master
npm install
cd ..
```

Then to update, all you need to do is login and type `./update.sh`

## license

Published and released under the [VOL](http://veryopenlicense.com).
