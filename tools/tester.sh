#!/usr/bin/env sh

GET_LIST=(
    "/"
    "/api/status"
    "/api/config/obtener"
    "/api/token/status"
    "/api/token/connected"
)

POST_LIST=(
    "/api/token/data"
    "/api/token/generate_csr"
    "/api/token/verificar_driver"
)

api_caller() {
   url="https://localhost:9000"$2
   cmd="http ${1} ${url} --body --verify false" 
   echo $2
   $cmd
}

for i in "${GET_LIST[@]}"
do
    api_caller "get" $i
done

for i in "${POST_LIST[@]}"
do
    api_caller "post" $i 
done
