#!/bin/bash
if [[ "$#" -ne 2 ]] ; then
    echo "parameter error"
    exit 84
fi
#ffmpeg -f lavfi -i anullsrc=r=11025 -t $1 -id3v2_version 3 $2
#ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t $1 -b:a 192k -acodec libmp3lame $2
ffmpeg -f lavfi -i anullsrc=r=22050:cl=mono -t $1 -id3v2_version 3 $2