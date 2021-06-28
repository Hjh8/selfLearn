@echo off
if "%1" == "h" goto begin 
start mshta vbscript:createobject("wscript.shell").run("%~nx0 h",0)(window.close)&&exit 
:begin

echo "Start submitting code to the local repository"
echo "The current directory is：%cd%"
git add .
echo;
 
echo "Commit the changes to the local repository"
set now=%date% %time%
echo %now%
git commit -m "%now%"
echo;
 
echo "Commit the changes to the remote git server"
git push origin master
echo;
 
echo "Batch execution complete!"
echo;
