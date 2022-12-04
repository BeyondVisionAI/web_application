echo "--------------------INSTALLING DEPENDENCIES-------------------------------"
npm i --legacy-peer-deps
echo "--------------------INSTALLING CRACO-------------------------------"
npm i -g @craco/craco
echo "--------------------BUILDING APP-------------------------------"
craco build