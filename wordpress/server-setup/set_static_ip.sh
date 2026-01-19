#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/install.env"

if [[ $(id -u) -ne 0 ]]; then
  echo "Run as root: sudo ./set_static_ip.sh"
  exit 1
fi

if ! command -v nmcli >/dev/null 2>&1; then
  echo "nmcli not found. Install NetworkManager or configure networking manually."
  exit 1
fi

if [[ -f "${ENV_FILE}" ]]; then
  # shellcheck disable=SC1090
  . "${ENV_FILE}"
fi

STATIC_CONN="${STATIC_CONN:-static-eth}"
STATIC_IFACE="${STATIC_IFACE:-}"
STATIC_IP="${STATIC_IP:-}"
STATIC_PREFIX="${STATIC_PREFIX:-24}"
STATIC_GATEWAY="${STATIC_GATEWAY:-}"
STATIC_DNS="${STATIC_DNS:-}"

nmcli device status

prompt_if_empty() {
  local var_name="$1"
  local prompt_text="$2"
  local current_value="${!var_name:-}"

  if [[ -n "$current_value" ]]; then
    return
  fi

  read -r -p "${prompt_text}: " current_value
  export "$var_name=$current_value"
}

prompt_if_empty STATIC_CONN "Enter NetworkManager connection name"
if [[ -z "${STATIC_IFACE}" ]]; then
  echo "Available devices:"
  nmcli device status
  guessed_iface="$(nmcli -t -f DEVICE,TYPE,STATE device status | awk -F: '$2=="ethernet" && $3=="connected" {print $1; exit}')"
  if [[ -n "${guessed_iface}" ]]; then
    STATIC_IFACE="${guessed_iface}"
    echo "Using detected interface: ${STATIC_IFACE}"
  else
    prompt_if_empty STATIC_IFACE "Enter ethernet interface name (example: eth0)"
  fi
fi
prompt_if_empty STATIC_IP "Enter static IP address (example: 192.168.68.57)"
prompt_if_empty STATIC_GATEWAY "Enter gateway address (example: 192.168.68.1)"
prompt_if_empty STATIC_DNS "Enter DNS server address (example: 1.1.1.1)"

if ! nmcli -t -f NAME connection show | grep -Fxq "${STATIC_CONN}"; then
  nmcli device status
  nmcli connection add type ethernet con-name "${STATIC_CONN}" ifname "${STATIC_IFACE}"
fi

echo "About to apply a static IP and restart the connection:"
echo "- Connection: ${STATIC_CONN}"
echo "- IP: ${STATIC_IP}/${STATIC_PREFIX}"
echo "- Gateway: ${STATIC_GATEWAY}"
echo "- DNS: ${STATIC_DNS}"
echo
echo "This may drop your SSH session. Type APPLY to continue:"
read -r confirm
if [[ "${confirm}" != "APPLY" ]]; then
  echo "Aborted."
  exit 1
fi

nmcli connection modify "${STATIC_CONN}" ipv4.addresses "${STATIC_IP}/${STATIC_PREFIX}"
nmcli connection modify "${STATIC_CONN}" ipv4.gateway "${STATIC_GATEWAY}"
nmcli connection modify "${STATIC_CONN}" ipv4.dns "${STATIC_DNS}"
nmcli connection modify "${STATIC_CONN}" ipv4.method manual
nmcli connection modify "${STATIC_CONN}" connection.autoconnect yes

nmcli connection up "${STATIC_CONN}"

echo "Static IP applied."
